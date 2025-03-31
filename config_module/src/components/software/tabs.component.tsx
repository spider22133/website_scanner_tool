import React from 'react'
import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { CustomTabProps } from '../../interfaces/common'

type Props = {
  tabs: CustomTabProps[]
}

const TabsComponent: React.FC<Props> = ({ tabs }) => {
  const [value, setValue] = React.useState('MAIN')
  return (
    <>
      <TabContext value={value}>
        <Box>
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
          <TabPanel key={index} value={tabType} sx={{ px: 0, pt: 2, pb: 0 }}>
            {tabContent}
          </TabPanel>
        ))}
      </TabContext>
    </>
  )
}

export default TabsComponent
