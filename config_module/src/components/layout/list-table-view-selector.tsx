import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TableRowsIcon from '@mui/icons-material/TableRows'
import MenuIcon from '@mui/icons-material/Menu'
import { ListViewType } from '../../interfaces/common'
import { Box } from '@mui/system'

type ListGridViewTabsProps = {
  handleActiveTab?: (newValue: ListViewType) => void
  currentViewPreference: ListViewType
}

const ViewSelectorTabs: React.FC<ListGridViewTabsProps> = ({ handleActiveTab, currentViewPreference }) => {
  const [value, setValue] = React.useState<ListViewType>(currentViewPreference)

  const handleChange = (event: React.SyntheticEvent, newValue: ListViewType) => {
    setValue(newValue)
    localStorage.setItem('lotListViewPreference', newValue)
    handleActiveTab && handleActiveTab(newValue)
  }

  return (
    <Box className="view-toggle">
      <Tabs value={value} onChange={handleChange} aria-label="Switch presentation view between list and grid layout">
        <Tab icon={<TableRowsIcon />} value={ListViewType.ListView} aria-label="List view" />
        <Tab icon={<MenuIcon />} value={ListViewType.TableView} aria-label="Table view" />
      </Tabs>
    </Box>
  )
}

export default ViewSelectorTabs
