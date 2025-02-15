import React, { useContext, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { editor } from 'monaco-editor';
import { GlobalContext } from '../../context/reducers/globalReducer';
import { updateFile } from '../../context/actions/globalActions';
import styles from './EditorView.module.scss';

const remote = window.require('electron').remote;
const fs = remote.require('fs');

const Editor = () => {
  const [{ file, filePath }, dispatchToGlobal] = useContext(GlobalContext);
  const [wasSaved, setWasSaved] = useState('');
  let editedText = '';

  const options = {
    selectOnLineNumbers: true,
    wordWrap: 'wordWrapColumn',
    wordWrapColumn: 90,
    autoIndent: true,
    colorDecorators: true,
    wrappingIndent: 'indent',
    automaticLayout: true,
  };

  const editorDidMount = () => {
    editor.setTheme('light-dark');
    // editor.focus();
  };

  const updatafile = (newValue, e) => {
    editedText = newValue;
    if (wasSaved.length) setWasSaved('');
  };
  const saveFile = async () => {
    if (editedText.length) {
      dispatchToGlobal(updateFile(editedText));
      if (!filePath.length) setWasSaved('Preview Saved, be sure to export file');
    } else setWasSaved('No Changes to Save');
    if (filePath.length && editedText.length) {
      setWasSaved('Changes Saved');
      await fs.writeFile(filePath, editedText, (err) => {
        if (err) throw err;
      });
    }
  };

  let fileType = filePath.split('.')[1];
  const extensionChecker = {
    png: 1,
    jpg: 1,
    gif: 1,
  };

  return (
    <div>
      <div onClick={() => setWasSaved('')}>
        <MonacoEditor
          height='80vh'
          language='javascript'
          theme='light-dark'
          value={
            file
              ? extensionChecker[fileType]
                ? '//Please select a valid file type'
                : file
              : '// Open a file or click preview to view your code.'
          }
          options={options}
          editorDidMount={editorDidMount}
          onChange={updatafile}
        />
      </div>

      <div>
        <button id={styles.save} onClick={saveFile}>
          Save Changes
        </button>
        <span id={styles.span}>{wasSaved}</span>
      </div>


    </div>
  );
};

export default Editor;
