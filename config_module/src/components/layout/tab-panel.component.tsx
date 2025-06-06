import React, { ReactElement } from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number | string
  value: number | string
}

const TabPanel = (props: TabPanelProps): ReactElement<any> => {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" className="tabpanel" hidden={value !== index} id={`${index}`} {...other}>
      {value === index && children}
    </div>
  )
}

export default TabPanel
