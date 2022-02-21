# importing libraries 
import speech_recognition as sr 
import os 
from pydub import AudioSegment
from pydub.silence import split_on_silence
from moviepy.editor import AudioFileClip
from pydub.utils import make_chunks

class TikTokSpeechRecognizer :
    """
    A class used to transcript tiktok videos into text

    ...

    Attributes
    ----------
    r : speech_recognition.Recognizer
        Recognizer from module speech_recognition to manage audio files transcription
    path_mp4 : str
        path where the mp4 video is stored
    path_wav : str
        path where to store the audio
    path_text : int
        path where to store the resulting text

    Methods
    -------
    convert_mp4_to_wav(name)
        Converts the mp4 video name.mp4 and saves the audio name.wav
        Returns the audio file name

    get_small_audio_transcription(wav)
        Transcripts small wav audio file
        Saves the resulting text
        Returns the text        

    get_large_audio_transcription(wav)
        Transcripts the wav audio file
        Saves the audio chunks and print their text chunks
        Saves the resulting text
        Returns the text
    """

    def __init__(self, path_mp4= "video", path_wav= "audio", path_text= "text") :
        # create a speech recognition object
        self.r = sr.Recognizer()

        # path to mp4 videos
        self.path_mp4 = path_mp4 + "/"

        # path to store the audio wav, and transcript result
        self.path_wav = path_wav + "/"
        self.path_text = path_text + "/"


    # convert a large (?) video file mp4 into audio file wav
    def convert_mp4_to_wav(self, mp4) :
        """
        Convert video file in format mp4 into an audio file in format wav
        Don't put the file extension, just the name
        
        Parameters :
        ----------
        name : str
            the name of the file, without the .mp4 extension

        Returns :
        ----------
        wav : str 
            the name of the resulting wav file
        """
        path_video = f"{self.path_mp4}{mp4}"
        audioclip = AudioFileClip(path_video) # Create AudioFileClip instance from module moviepy
        name_mp4_file = os.path.splitext(mp4)[0] # name of file without the .mp4 extension
        path_audio = f"{self.path_wav}{name_mp4_file}.wav"
        # Create audio directory if not exist
        if not os.path.isdir(self.path_wav):
            os.mkdir(self.path_wav)
        audioclip.write_audiofile(path_audio) # Write wav file 

        return f"{name_mp4_file}.wav"


    def get_small_audio_transcription(self, wav) :
        """
        For small audio file 
        Apply speech recognition
        Save the transcription text in the specified path
        
        Parameters :
        ----------
        wav : str
            the wav file, with .wav extension

        Returns :
        ----------
        text : str
            the transcribed text from the audio
        """
        filename = f"{self.path_wav}/{wav}"
        text = "Error happened"
        # open the file
        with sr.AudioFile(filename) as source:
            # listen for the data (load audio to memory)
            audio_data = self.r.record(source)
            # try recognize (convert from speech to text)

            try:
                text = self.r.recognize_google(audio_data)
            except sr.UnknownValueError as e:
                print("Error:", str(e))
            else:
                text = f"{text.capitalize()}. "

            # Save text into file
            # create a directory to store the text if it doesn't exist
            if not os.path.isdir(self.path_text):
                os.mkdir(self.path_text)
            name_wav_file = os.path.splitext(wav)[0] # name of file iwthout the .wav extension
            with open(f"{self.path_text}{name_wav_file}.txt", 'w') as f:
                f.write(text)
            return text

    # a function that splits the audio file into chunks
    # and applies speech recognition
    def get_large_audio_transcription(self, wav):
        """
        Splitting the large audio file into chunks
        and apply speech recognition on each of these chunks.
        Save each audio chunk in the specified path
        Save the transcription text in the specified path
        
        Parameters :
        ----------
        wav : str
            the wav file, with .wav extension

        Returns :
        ----------
        whole_text : str
            the transcribed text from the full audio
        """
        # open the audio file using pydub
        sound = AudioSegment.from_wav(f"{self.path_wav}{wav}")  
        # split audio sound where silence is 700 miliseconds or more and get chunks
        chunks = split_on_silence(sound,
        # experiment with this value for your target audio file
        min_silence_len = 500,
        # adjust this per requirement
        silence_thresh = sound.dBFS-14,
        # keep the silence for 1 second, adjustable as well
        keep_silence=500,
        )
        #chunks = make_chunks(sound, 5000) #Make chunks of millisec

        name_wav_file = os.path.splitext(wav)[0] # name of file iwthout the .wav extension
        folder_name = f"audio_chunks/{name_wav_file}"
        # create a directory to store the audio chunks if it doesn't exist
        if not os.path.isdir(folder_name):
            if not os.path.isdir("audio_chunks"):
                os.mkdir("audio_chunks")
            os.mkdir(folder_name)
        whole_text = ""
        # process each chunk 
        for i, audio_chunk in enumerate(chunks, start=1):
            # export audio chunk and save it in
            # the `folder_name` directory.
            chunk_filename = os.path.join(folder_name, f"chunk{i}.wav")
            audio_chunk.export(chunk_filename, format="wav")
            # recognize the chunk
            with sr.AudioFile(chunk_filename) as source:
                # Supposed to help with the ambient noise ?..
                #r.adjust_for_ambient_noise(source)
                audio_listened = self.r.record(source)
                # try converting it to text
                try:
                    text = self.r.recognize_google(audio_listened)
                except sr.UnknownValueError as e:
                    print("Error:", str(e))
                else:
                    text = f"{text.capitalize()}. "
                    print(chunk_filename, ":", text)
                    whole_text += "\n" + text

        # Save text into file
        # create a directory to store the text if it doesn't exist
        if not os.path.isdir(self.path_text):
            os.mkdir(self.path_text)
        with open(f"{self.path_text}{name_wav_file}.txt", 'w') as f:
            f.write(whole_text)
        
        # return the text for all chunks detected
        return whole_text





def main() :
    tiktokSR = TikTokSpeechRecognizer("video") # put directory of the videos
    # If wav not available, you can get it from the mp4 (for example, deep_learning.mp4 or icarus.mp4)
    wav = tiktokSR.convert_mp4_to_wav("story-tiktok.mp4") # wav is the name of the wav file in the audio directory. icarus.wav for example
    # If wav available you can transcript it. Either in 1 pass or with multiple chunks of audio.
    # Note that recognize_google() calls an API and has a limit on the amount of data, so for large audio files, use chunks.
    #text_without_chunks = tiktokSR.get_small_audio_transcription(wav) # try in 1 pass without chunks ?
    #print(text_without_chunks)
    text_with_chunks = tiktokSR.get_large_audio_transcription(wav)

if __name__ == '__main__' :
    main()