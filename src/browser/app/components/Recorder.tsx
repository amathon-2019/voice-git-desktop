import { IconButton, makeStyles, Theme } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import React, { memo, useCallback } from 'react';

interface Props {
  onRecord?: (data: Blob) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: 'none',
    height: '200px',
    backgroundColor: theme.palette.background.default,
  },
}));

function Recorder({ onRecord }: Props) {
  const classes = useStyles([]);
  // const recorderRef = useRef<MediaRecorder | null>(null);
  // const streamRef = useRef<MediaStream | null>(null);
  // const [isRecording, setIsRecording] = useState(false);
  // const chunks = useRef<Blob[]>([]);

  const toggleRecord = useCallback(async () => {
    const chunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    const r = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    r.addEventListener('dataavailable', (event: BlobEvent) => {
      if (typeof event.data === 'undefined') {
        return;
      }

      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    r.addEventListener('stop', () => {
      const data = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(data);

      const a = document.getElementById('download')! as HTMLAnchorElement;
      a.href = url;
      a.download = 'result.webm';

      document.getElementById('aa')!.setAttribute('src', url);
    });

    r.start();

    window.setTimeout(() => {
      r.stop();
    }, 3000);
  }, []);

  // const onRecordComplete = useCallback((data: Blob) => {
  //   const url = URL.createObjectURL(data);
  //   const a = document.getElementById('download')! as HTMLAnchorElement;
  //   a.href = url;
  //   a.download = 'result.webm';
  //
  //   document.getElementById('aa')!.setAttribute('src', url);
  //   // const fileReader = new FileReader();
  //   //
  //   // fileReader.onload = function () {
  //   //   const arrayBuffer = fileReader.result as ArrayBuffer;
  //   //   let buffer = new Buffer(arrayBuffer.byteLength);
  //   //   let arr = new Uint8Array(arrayBuffer);
  //   //   for (let i = 0; i < arr.byteLength; i++) {
  //   //     buffer[i] = arr[i];
  //   //   }
  //   //
  //   //   writeFile('/Users/seokju.me/e', buffer);
  //   // };
  //   //
  //   // fileReader.readAsArrayBuffer(data);
  // }, []);

  return (
    <div className={classes.container}>
      <IconButton onClick={toggleRecord}>
        <FiberManualRecordIcon/>
      </IconButton>
      <a id="download">Download</a>
      <audio id="aa" controls/>
    </div>
  );
}

export default memo(Recorder);
