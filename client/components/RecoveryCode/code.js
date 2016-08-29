import React from 'react'

const formatCode = code => code.match(/(.{1,4})/g).join(' - ')

const style = {
  background: 'transparent',
  border: 'none',
  color: 'black',
  display: 'inline-block',
  lineHeight: '116%',
  textAlign: 'center',
  width: '25em',
}

function handleClick(event) {
  const element = event.target
  if (element.setSelectionRange) {
    element.setSelectionRange(0, element.value.length)
  }
}

export default function Code({ recoveryCode }) {
  return (<input
    style={style}
    readOnly='true'
    onClick={handleClick}
    value={formatCode(recoveryCode)}
  />)
}

Code.propTypes = {
  recoveryCode: React.PropTypes.string,
}
