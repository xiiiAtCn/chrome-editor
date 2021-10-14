import React, { useState } from "react";

const Editor = () => {

  const [showEditor, setShowEditor] = useState<boolean>(true);

  const toggle = () => {
    setShowEditor(!showEditor)
  }


  return (
    <div style={{ position: 'fixed', left:  '50%', top: 0, right: 0, bottom: 0, zIndex: 9999,transition: '0.3s', background: 'pink', transform: showEditor ? 'translate3D(0, 0, 0)' : 'translate3D(100%, 0, 0)' }}>
      <button onClick={ toggle } style={{ position: 'absolute',left: showEditor ? '0': '-100px' }}>toggle</button>
    </div>
  )
}

export default Editor