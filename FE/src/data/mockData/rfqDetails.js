export const INITIAL_MOCK_RFQ_DATA = [
  {
    no: 1,
    desc: 'PANEL ASSY, FLOOR, LH',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0001-RO1',
    pno: '5251409289',
    aes: 'A',
    quantity: 1,
    status: 'Under Review',
    date: '08/01/2025 2:30PM',
    timestamp: new Date('2025-01-08T14:30:00').getTime(),
    lastEditedBy: {
      name: 'Admin User',
      initials: 'AD',
      timestamp: '08/01/2025 2:30PM'
    },
    collaborators: [
      {
        id: '2',
        name: 'erma',
        email: 'erma@baktiudara.com',
        initials: 'ER',
        addedAt: '08/01/2025 1:00PM'
      },
      {
        id: '3',
        name: 'adda',
        email: 'adda@baktiudara.com',
        initials: 'AD',
        addedAt: '08/01/2025 12:30PM'
      }
    ]
  },
  {
    no: 2,
    desc: 'RELAY, SOCKET',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0002-RO1',
    pno: '9742200100',
    aes: 'E',
    quantity: 3,
    status: 'Sent to OEM',
    date: '08/01/2025 10:15AM',
    timestamp: new Date('2025-01-08T10:15:00').getTime(),
    lastEditedBy: {
      name: 'John Smith',
      initials: 'JS',
      timestamp: '08/01/2025 10:15AM'
    }
  },
  {
    no: 3,
    desc: 'ROD ASSY, PUSH/PULL, FRONT',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0003-RO1',
    pno: '576.10.09.021',
    aes: 'E',
    quantity: 1,
    status: 'Quoted',
    date: '07/01/2025 3:45PM',
    timestamp: new Date('2025-01-07T15:45:00').getTime(),
    lastEditedBy: {
      name: 'Sarah Wilson',
      initials: 'SW',
      timestamp: '07/01/2025 3:45PM'
    }
  }
]

export const INITIAL_DOCUMENTS = [
  {
    id: 1,
    name: 'Technical Specifications.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '08/01/2025 1:45PM',
    url: '#'
  },
  {
    id: 2,
    name: 'Engineering Drawings.dwg',
    type: 'DWG',
    size: '5.1 MB',
    uploadDate: '07/01/2025 4:20PM',
    url: '#'
  },
  {
    id: 3,
    name: 'Material Certificate.xlsx',
    type: 'Excel',
    size: '1.2 MB',
    uploadDate: '05/01/2025 9:30AM',
    url: '#'
  },
  {
    id: 4,
    name: 'Quality Inspection Report.pdf',
    type: 'PDF',
    size: '3.8 MB',
    uploadDate: '01/01/2025 11:15AM',
    url: '#'
  }
]

export const INITIAL_AVAILABLE_USERS = [
  { id: '1', name: 'aliff', email: 'aliff@baktiudara.com' },
  { id: '2', name: 'erma', email: 'erma@baktiudara.com' },
  { id: '3', name: 'adda', email: 'adda@baktiudara.com' },
  { id: '7', name: 'shahmail', email: 'shahmail@baktiudara.com' },
  { id: '8', name: 'zico', email: 'zico@baktiudara.com' }
]

export const INITIAL_COLLABORATORS = [
  {
    id: '2',
    name: 'erma',
    email: 'erma@baktiudara.com',
    initials: 'ER',
    addedAt: '08/01/2025 1:00PM'
  },
  {
    id: '3',
    name: 'adda',
    email: 'adda@baktiudara.com',
    initials: 'AD',
    addedAt: '08/01/2025 12:30PM'
  }
]

