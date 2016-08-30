/* eslint-env jest */
import React from 'react'
import renderer from 'react-test-renderer'
import RecoveryCode from '.'

describe('RecoveryCode', () => {
  it('displays button to regenerate', () => {
    const component = renderer.create(
      <RecoveryCode
        enabled
        handleRegenerateRecoveryCode={() => {}}
      />
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('displays new code', () => {
    const component = renderer.create(
      <RecoveryCode
        enabled
        recoveryCode='ABCDEFGHIJKLMNOPQRSTUVWX'
        handleRegenerateRecoveryCode={() => {}}
      />
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
