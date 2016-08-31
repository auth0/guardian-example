import React from 'react'
import style from './style.css'

const formatCode = code => code.match(/(.{1,4})/g).join(' - ')

function handleClick(event) {
  const element = event.target
  if (element.setSelectionRange) {
    element.setSelectionRange(0, element.value.length)
  }
}

export default function Code({ recoveryCode }) {
  return (
    <input
      className={style['new-recovery-code']}
      readOnly
      onClick={handleClick}
      value={formatCode(recoveryCode)}
    />
  )
}

Code.propTypes = {
  recoveryCode: React.PropTypes.string,
}
