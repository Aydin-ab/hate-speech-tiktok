# hate-speech-tiktok
Building a Hate Speech Detector on TikTok




## How to use it :

First install the environment by following the instructions of env_installation.md


To transcript a video .mp4 :
- Put the mp4 video you wish to transcript in the video folder
- In the main function : 
  - Use convert_mp4_to_wav to convert the mp4 into a wav file stored in the directory audio
  - If you want to transcript the audio in 1 pass then use get_small_audio_transcription
  - If you want to divide the audio in chunks and transcribe them one by one, use get_large_audio_transcription

To transcript a audio .wav :
- Put the wav audio you wish to transcript in the audio folder
- In the main function : 
  - If you want to transcript the audio in 1 pass then use get_small_audio_transcription
  - If you want to divide the audio in chunks and transcribe them one by one, use get_large_audio_transcription


The transcribed text is stored in the text folder

More details on the audio "chunks". The transciption is done with multiple api calls to the google transcriptor. Unfortunately there is a limit of data we can process in 1 call. Therefore, we have to cut long audio files into chunks.

You will find 2 ways of defining the chunks : 
- One will cut the audio based on the silence. It is useful when dealing with videos containings only speeches and not surrounding music like many tiktok videos may have. This way, the recorder will "notice" when a sentence is finished so there will be less chances of a word being cut in half between chunks.

- The other will cut the audio in same length of milliseconds. For examples multiple audio chunks of 30 seconds. It is useful for videos with a lot of background music or ambient noise where it's hard for the recorder to know when a sentence is finished or not.



## My results
You can find videos and audio I tested for now, along with the output text of my code here :
https://drive.google.com/drive/folders/1bKgYu4zR8qYid-RlUqJtdC2-w5JheCEf?usp=sharing

I have tested multiple videos with variable performance on each :
- icarus.mp4 : A 5 minutes youtube video telling the story of Iccarus, no background noise or music. Well articulated english.
- deep_learning.mp4 : A 45 minutes youtube video of a deep learning course given in an amphitheater. There is a huge background noise during the whole video
- harvard.wav : A 5 seconds audio of an english sentence, with a weird accent. No background noise.
- story-tiktok.mp4 : A 5 minutes tiktok video of a girl telling a story. No background music but a bit of noise. Quality of the audio close to a typical phone today
- robot-voice-tiktok.mp4 : a 1 minute tiktok video of a DIY video, a typical popular content on tiktok. Robotic voices are used a lot. Lot of background music.
- stand-up-tiktok.mp4 : a 3 minutes tiktok videos of an audio sketch, laso a very typical tiktok video. Lot of side noises to ignore. Bit of noise.

Results :
- icarus.mp4 : Very good transcription
- deep_learning.mp4 : Very bad transcription. Some parts are perfectly transcribed, some are not transcribed nicely and most are not even transcribed at all
- harvard.wav : Perfect Transcription
- story-tiktok.mp4 : Quite good transciprtion but can be perfected. May be enough for the detector
- robot-voice-tiktok.mp4 : Almost good, didn't get sensitive to the music or useless sounds
- stand-up-tiktok.mp4 : Almost perfect, may be enough for a detection
