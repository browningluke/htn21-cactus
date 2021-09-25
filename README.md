# CactUs - taking Cact-I to Cact-Us!
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<div style="text-align:center">
	<a href="http://www.youtube.com/watch?v=9f9AvXelATc">
		<img src="http://img.youtube.com/vi/9f9AvXelATc/0.jpg">
	</a>
</div>

## Inspiration
As students, we may unintentionally compare ourselves to peers and cause a domino effect of resentment towards others, and towards ourselves. This deprivation of joy leads to weariness and self-doubt, resulting in a poor mental health state. To alleviate the struggles and stress people face, we are ready to take it from “Cact-i” to “Cact-Us”, a web app that encourages positivity through the form of positive affirmations that grow your plant.

## What it does
Users can record themselves on the “Try Me!” button voicing words of affirmations. Controlled with a points system, positive affirmations contribute to the plant’s growth in unlocking more stylish plant evolutions, while negative affirmations result in a decrease of points. The ultimate goal is to reach the desired state--Level 4 Cactus-- where the Cactus is happy and fulfilled.

## Challenges we ran into
Working with the MediaRecorder API, it was a challenge to tailor the React package to our use cases and convert the blob to a file that could be sent to our backend endpoints. Given that we were using the Google Cloud Speech-to-Text API, we had to send the audio data in one of a limited number of codecs. One challenge we ran into was the React media recorder output data not being compatible with Google’s requirement. This was fixed by transcoding the audio data in a memory buffer using ffmpeg.

Given that we were using the Google Cloud Speech-to-Text API, we had to send the audio data in one of a limited number of codecs. One challenge we ran into was the React media recorder output data not being compatible with Google’s requirement. This was fixed by transcoding the audio data in a memory buffer using ffmpeg.

## Accomplishments that we're proud of
- The Speech-to-Text integration, paired with the sentiment analysis, took a while to get working, but it works well
- The in-memory audio transcoding with ffmpeg fixed all issues with incompatible codecs
- The user is successfully awarded growth points depending on the length of their audio snippets

## What we learned
- Frontend: React & React packages
- Backend: Express & OAuth
- Integration between frontend and backend
- Collaborating over varying time zones

## What's next for CactUs
- Forest of previous cacti: each cactus shows how long it took to grow, and 3 random messages that were said to it.
- Multi-player: by generating a unique QR code, a user will be able to ‘check-in’ with another, allowing their cacti to have a playdate.
- Messaging: text notifications through Discord to alert the user that the cacti is feeling dumb and sad again.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/k-chew"><img src="https://avatars.githubusercontent.com/u/60660250?v=4?s=100" width="100px;" alt=""/><br /><sub><b>k-chew</b></sub></a><br /><a href="https://github.com/browningluke/htn21-cactus/commits?author=k-chew" title="Code">💻</a> <a href="#design-k-chew" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/clianggg"><img src="https://avatars.githubusercontent.com/u/76232513?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Christina Liang</b></sub></a><br /><a href="https://github.com/browningluke/htn21-cactus/commits?author=clianggg" title="Code">💻</a> <a href="#design-clianggg" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/selina-20"><img src="https://avatars.githubusercontent.com/u/90948575?v=4?s=100" width="100px;" alt=""/><br /><sub><b>selina-20</b></sub></a><br /><a href="#design-selina-20" title="Design">🎨</a> <a href="https://github.com/browningluke/htn21-cactus/commits?author=selina-20" title="Documentation">📖</a></td>
    <td align="center"><a href="http://linkedin.com/in/browningluke"><img src="https://avatars.githubusercontent.com/u/24992944?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Luke Browning</b></sub></a><br /><a href="https://github.com/browningluke/htn21-cactus/commits?author=browningluke" title="Code">💻</a> <a href="#infra-browningluke" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.