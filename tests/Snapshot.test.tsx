import React from 'react'
import renderer from 'react-test-renderer'
import { WarningPopup } from '../src/components/WarningPopup'
import { LoadingIndicator } from '../src/components/LoadingIndicator'

it('Error warning should render correctly', () => {

  const tree = renderer.create(<WarningPopup title="Warning" message="Something went wrong." isOpen={true} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('Loading indicator should render correctly', () => {
  const tree = renderer.create(<LoadingIndicator text="Loading information" />).toJSON()
  expect(tree).toMatchSnapshot()
})
