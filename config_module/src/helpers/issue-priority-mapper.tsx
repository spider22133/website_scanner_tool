export const PRIORITY_MAP: Record<
  string,
  {
    name: string
    description: string
    iconUrl: string
    statusColor: string
  }
> = {
  '1': {
    name: 'Highest',
    description: 'This problem will block progress.',
    iconUrl: 'https://jira.med.tu-dresden.de/images/icons/priorities/highest.svg',
    statusColor: '#d04437',
  },
  '2': {
    name: 'High',
    description: 'Serious problem that could block progress.',
    iconUrl: 'https://jira.med.tu-dresden.de/images/icons/priorities/high.svg',
    statusColor: '#f15C75',
  },
  '3': {
    name: 'Medium',
    description: 'Has the potential to affect progress.',
    iconUrl: 'https://jira.med.tu-dresden.de/images/icons/priorities/medium.svg',
    statusColor: '#f79232',
  },
  '4': {
    name: 'Low',
    description: 'Minor problem or easily worked around.',
    iconUrl: 'https://jira.med.tu-dresden.de/images/icons/priorities/low.svg',
    statusColor: '#707070',
  },
  '5': {
    name: 'Lowest',
    description: 'Trivial problem with little or no impact on progress.',
    iconUrl: 'https://jira.med.tu-dresden.de/images/icons/priorities/lowest.svg',
    statusColor: '#999999',
  },
}
