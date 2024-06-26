import React, { useState, useRef } from 'react';
import { Button, Box, Typography } from '@mui/material';

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const maxRecordingTime = 15000; // 15 seconds

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                audioChunksRef.current = [];
                await uploadAudio(audioBlob); // Call the upload function
            };

            mediaRecorder.start();
            setRecording(true);
            setErrorMessage('');

            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    setRecording(false);
                }
            }, maxRecordingTime);
        } catch (error) {
            console.error('Error accessing audio devices:', error);
            setErrorMessage('Error accessing audio devices.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const uploadAudio = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
            const response = await fetch('http://localhost:3002/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            console.log('Upload successful', data);
        } catch (error) {
            console.error('Error uploading audio:', error);
            setErrorMessage('Error uploading audio.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Typography variant="h6">Audio Recorder</Typography>
            <Box mt={2}>
                {!recording ? (
                    <Button variant="contained" color="primary" onClick={handleStartRecording}>
                        Start Recording
                    </Button>
                ) : (
                    <Button variant="contained" color="secondary" onClick={handleStopRecording}>
                        Stop Recording
                    </Button>
                )}
            </Box>
            {audioURL && (
                <Box mt={2}>
                    <Typography variant="subtitle1">Recorded Audio:</Typography>
                    <audio controls src={audioURL} />
                </Box>
            )}
            {errorMessage && (
                <Typography variant="body1" color="error" mt={2}>
                    {errorMessage}
                </Typography>
            )}
        </Box>
    );
};

export default AudioRecorder;
