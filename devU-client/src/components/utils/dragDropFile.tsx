import React from "react";
import styles from './dragDropFile.scss';
import Button from '@mui/material/Button'

function DragDropFile() {
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    
    // handle drag events
    const handleDrag = function(e : React.DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
    
    // triggers when file is dropped
    const handleDrop = function(e : React.DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        console.log('file dropped');
      }
    };
    
    // triggers when file is selected with click
    const handleChange = function(e : React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        console.log('file selected');
      }
    };
    
  // triggers the input when the button is clicked
    const handleClick = () => {
        if(inputRef.current != null ) {
            inputRef.current.click();
        }
    };
    
    return (
      <form id="form-file-upload" className={styles.formFileUpload} onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" id="input-file-upload" className={styles.inputFileUpload} multiple={true} onChange={handleChange} />
        <label id="label-file-upload" className={styles.labelFileUpload} htmlFor="input-file-upload">
          <div>
            <p>Drag and drop your file here or</p>
            <Button className={styles.uploadButton} onClick={handleClick}>Upload a file</Button>
          </div> 
        </label>
        { dragActive && <div id="drag-file-element" className={styles.dragFileElement} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
      </form>
    );
  };

export default DragDropFile;