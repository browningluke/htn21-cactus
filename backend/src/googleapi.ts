import speech from "@google-cloud/speech";
import language from "@google-cloud/language";

import concat from "concat-stream";
import ffmpeg from "fluent-ffmpeg";

import {Readable} from "stream";

export default class GoogleAPI {

    speechClient = new speech.SpeechClient();
    languageClient = new language.LanguageServiceClient();

    private async getSentimentOfText(text: string) {
        // Detects the sentiment of the text
        const [result] = await this.languageClient.analyzeSentiment({document: {
            content: text,
            type: "PLAIN_TEXT"
        }});
        const sentiment = result.documentSentiment;
        const score =  sentiment?.score!
        const magnitude = sentiment?.magnitude!;

        let scoreVal: number;

        // -0.2 <= x <= 0.2
        if (magnitude <= 0.35) {
            console.log(`It's neutral`);
            scoreVal = 0;
        } else if (score <= 0) {
            console.log(`It's negative`);
            scoreVal = -1;
        } else {
            console.log(`It's positive`);
            scoreVal = 1;
        }

        return {
            text: text,
            score: scoreVal
        }
    }

    private async getTextFromSpeech(buffer: Buffer) {
        console.log("Ran async! Length: ", buffer.length);

        return new Promise((resolve, reject) => {
            const gotData = async (buffer: Buffer) => {
                let base64data = buffer.toString('base64');
                //console.log(base64data);

                const [resp] = await this.speechClient.recognize({
                    config: {
                        encoding: "LINEAR16",
                        sampleRateHertz: 16000,
                        languageCode: 'en-US',
                    },
                    audio: {
                        content: base64data
                    }
                });
                // @ts-ignore
                resolve(resp.results.map(result => result.alternatives[0].transcript).join('\n'));
            }

            let goodStream = concat(gotData);

            try {
                ffmpeg(Readable.from(buffer))
                    .format('wav')
                    .audioCodec('pcm_s16le')
                    .audioChannels(1)
                    .audioFrequency(16000)
                    .writeToStream(goodStream, { end: true });
            } catch (e) {
                reject(e);
            }
        })
    }

    async handleSpeechAnalysis(buffer: Buffer) {
        const text = await this.getTextFromSpeech(buffer) as string;
        return await this.getSentimentOfText(text);
    }
}

