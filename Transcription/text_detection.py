# Import required packages
import cv2
import pytesseract
import os
import re
import numpy as np

class TikTokTextDetector:
    """
    A class used to detect text in tiktok videos and save them in a file

    ...

    Attributes
    ----------
    path_mp4 : str
        path where the mp4 video is stored
    path_text : int
        path where to store the resulting text

    Methods
    -------
    prepare_video_and_file(self, mp4)
        Load the video and prepare the text file.
        Returns the video and the name of the text file

    pre_processing(self, frame)
        Pre-processing of a frame before the text detection
        Returns the processed frame

    clean_and_save_text(self, text, name_mp4_file)
        Clean the text detected by pytesseract.
        Removes newlines, trailing spaces etc...
        TODO later : Remove the garbage words that means nothing
        Returns the cleaned text

    print_every_N_frames(self, framenbr, N= 100)
        Print the evolution of the dectection to see the advancement

    detect_text(self, mp4)
        Detect the texts in a video
        Load the video, read each frame, pre-process them, detect the text
        Save detected text in the text folder (defined in the initialization)
    """

    def __init__(self, path_mp4= "video", path_text= "detected_text") -> None:
        # Mention the installed location of Tesseract-OCR in your system
        # If on windows :
            # 1. Install tesseract using windows installer available at: https://github.com/UB-Mannheim/tesseract/wiki

            # 2. Note the tesseract path from the installation. Default installation path at the time of this edit was: C:\Users\USER\AppData\Local\Tesseract-OCR\\tesseract.exe. It may change so please check the installation path.

            # 3. pip install pytesseract 

            # 4. Set the tesseract path in the script
        # If on Mac/Linux :
            # Install it and set the path to "/usr/local/bin/tesseract" or whatever directory it got installed
            # You can find the directory with the shell command "where tesseract"
        pytesseract.pytesseract.tesseract_cmd = '/usr/local/bin/tesseract'

        # Path the mp4 video we want to process
        self.path_mp4 = path_mp4
        self.path_text = path_text

    
    def prepare_video_and_file(self, mp4) :
        """
        Load the video and prepare the text file.
        It will delete the content of the previous file if it exists

        Parameters :
        ----------
        mp4 : str
            The name of the file, with the .mp4 extension

        Returns :
        ----------
        vidcap : VideoCapture 
            VideoCapture instance of cv2. Will be used to read the frames
        
        name_file : the name of the text file in its directory, without the .txt extension
        """

        vidcap = cv2.VideoCapture(f"{self.path_mp4}/{mp4}")

        name_file = os.path.splitext(mp4)[0] # name of file without the .mp4 extension

        # Save text into file
        # create a directory to store the text if it doesn't exist
        if not os.path.isdir(self.path_text):
            os.mkdir(self.path_text)
        f = open(f"{self.path_text}/{name_file}.txt", "w+")
        f.write("")
        f.close()

        return vidcap, name_file

    def pre_processing(self, frame) :
        """
        Pre-process the frame before the contour detection
        You can choose which pre-processing to do here
        Definitely a good way to improve the performance    

        Parameters :
        ----------
        frame : OutputArray
            Current frame

        Returns :
        ----------
        dilation : OutputArray 
            Pre-processed frame
        """

        # Preprocessing the image starts
        invert = cv2.bitwise_not(frame)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Performing OTSU threshold
        ret, thresh1 = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)

        # Specify structure shape and kernel size.
        # Kernel size increases or decreases the area
        # of the rectangle to be detected.
        # A smaller value like (10, 10) will detect
        # each word instead of a sentence.
        rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (18, 18))



        cv2.imshow("ntm", thresh1)
        cv2.waitKey(0)

        # Applying dilation on the threshold image
        dilation = cv2.dilate(thresh1, rect_kernel, iterations = 1)

        return dilation

    def clean_and_save_text(self, text, name_txt_file):
        """
        Clean the detected text and ignore the newlines or trailing spaces
        Improves the visualization of the results in the .txt files 
        Saves the cleaned text in the .txt file 

        Parameters :
        ----------
        text : str
            Detected text 
        
        name_mp4_file : str
            name of the txt file in its directory, without the .txt extension
        """
    
        # Post-processing the text : We remove the blanks and newlines
        if text != '\x0c' or text != ' \x0c' :
            # Remove unnecessary \n
            text = re.sub(r'( )?\n( )?(( )?\n( )?)*( )?' , r' ',text)
            # Remove unnecessary new lines
            text = re.sub(r'( )?\x0c( )?(( )?\x0c( )?)*( )?', r' ', text) 
            # Remove trailing spaces
            text = text.strip()
        if text != '':
            # Open the file in append mode
            file = open(f"{self.path_text}/{name_txt_file}.txt", "a")
            file.write(text)
            file.write("\n")
            
            # Close the file
            file.close

    def print_every_N_frames(self, framenbr, N= 100) :
        """
        Print the evolution of the detection every N frames

        Parameters :
        ----------
        framenbr : int
            Current count of frames processed  
        
        N : int
            Number of frames on which we print the evolution
        """

        if framenbr % N == 0 :
                if framenbr != 0 :
                    print(f"Processed frames : {framenbr - 100 + 1} to {framenbr}")

    def detect_text(self, mp4) :
        """
        Detects texts on a video
        Loads the video, Reads each frame, Pre-process them,
        Detects the texts on each of them and saves them in a file

        Parameters :
        ----------
        mp4 : str
            path to the mp4 video, with the .mp4 extension
            Must be present in self.path_mp4 directory
        """

        vidcap, name_file = self.prepare_video_and_file(mp4)

        success,frame = vidcap.read()
        framenbr = 0
        while success:

            framenbr += 1
            self.print_every_N_frames(framenbr, N=100)

            success,frame = vidcap.read()
            if not success: # Means we reached the end of video
                break
            # We process only 1 every 10 frames to avoid redundacies and save time
            if framenbr % 10 != 1 :
                 continue
            
            pre_proc_frame = self.pre_processing(frame)

            contours, hierarchy = cv2.findContours(pre_proc_frame, cv2.RETR_EXTERNAL,
												cv2.CHAIN_APPROX_NONE)
            # Creating a copy of image
            im2 = frame.copy()

            # Looping through the identified contours
            # Then rectangular part is cropped and passed on
            # to pytesseract for extracting text from it
            # Extracted text is then written into the text file
            for cnt in contours:
                x, y, w, h = cv2.boundingRect(cnt)
                
                # Drawing a rectangle on copied image
                rect = cv2.rectangle(im2, (x, y), (x + w, y + h), (0, 255, 0), 2)
                
                # Cropping the text block for giving input to OCR
                cropped = im2[y:y + h, x:x + w]
                


                # Apply OCR on the cropped image
                text = pytesseract.image_to_string(cropped)
                self.clean_and_save_text(text, name_file)
            
def main() :
    tiktokTD = TikTokTextDetector(path_mp4= "video", path_text= "detected_text")
    tiktokTD.detect_text("sketch-subtitles-tiktok.mp4")

if __name__ == '__main__':
    main()