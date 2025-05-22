import React from 'react'
import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { CustomTabProps } from '../../../interfaces/common'

type Props = {
  tabs: CustomTabProps[]
}

const TabsComponent: React.FC<Props> = ({ tabs }) => {
  const [value, setValue] = React.useState('MAIN')
  return (
    <TabContext value={value}>
      <Box className="tabs-container">
        <Box className="tab-list-wrapper">
          <TabList onChange={(e, newValue) => setValue(newValue)} variant="scrollable">
            {tabs.map(({ tabType, tabLabel, tabIcon }, index) => (
              <Tab
                key={index}
                icon={tabIcon}
                label={tabLabel}
                value={tabType}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                iconPosition="start"
              />
            ))}
          </TabList>
        </Box>
        {tabs.map(({ tabType, tabContent }, index) => (
          <TabPanel key={index} value={tabType} className="tab-panel" sx={{ px: 0, pt: 2, pb: 2.1 }}>
            {tabContent()}
          </TabPanel>
        ))}
      </Box>
    </TabContext>
  )
}

export default TabsComponent
