import { useReactMediaRecorder } from "react-media-recorder";
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import axios from 'axios';

const RecordView = () => {
    const [isLoading, setLoading] = useState(false);
    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({
      audio: true,
      mediaRecorderOptions: {
          type: "audio/wav; codecs=opus"
      },
      onStop: (blobUrl, blob) => {
        setLoading(true);
        console.log(blobUrl);
        const audiofile = new File([blob], "audiofile.wav", { type: "audio/wav" })
        console.log(audiofile);
        const formData = new FormData();
        formData.append("file", audiofile);

        axios.post('http://localhost:8080/api/speech', formData)
            .then((res) => {
                console.log(res.data)
            }).catch((error) => {
                console.log(error)
            });
        setLoading(false);
      }
    });

  return (
    <div>
      {status === "recording" ? <Button variant="primary" disabled={isLoading} onClick={!isLoading?stopRecording:null}>Send</Button> : <Button onClick={startRecording}>Record</Button>}
      {mediaBlobUrl != null && <audio src={mediaBlobUrl} controls/>}
    </div>
  );
};

export default RecordView;