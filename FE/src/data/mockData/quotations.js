export const INITIAL_QUOTATION_LIST = [
  // 1 quotation number can have many RFQs (each line item has its own rfqNo)
  {
    no: 1,
    quotationNo: '20081072',
    referenceNo: '04',
    offerDate: '5/1/2024',
    validityDate: '4/4/2024',
    validityStatus: 'Expired',
    daysRemaining: -688,
    currency: 'CHF',
    totalAmount: 6234.50,
    rfqNo: 'SPQM50-04012024-0001-NORMAL', // first line item's RFQ for list/header compatibility
    lineItems: [
      {
        no: 1,
        rfqNo: 'SPQM50-04012024-0001-NORMAL',
        desc: 'SEAL UNIT',
        pno: '5321072006',
        aes: 'A',
        quantity: 1,
        unitOfMeasure: 'EA',
        unitPrice: 1850.00,
        totalPrice: 1850.00,
        tat: 150
      },
      {
        no: 2,
        rfqNo: 'SPQM50-04012024-0002-NORMAL',
        desc: 'SENSOR,ASSY,TEMPERATURE',
        pno: '9761733252',
        aes: 'A',
        quantity: 35,
        unitOfMeasure: 'EA',
        unitPrice: 98.50,
        totalPrice: 3447.50,
        tat: 150
      },
      {
        no: 3,
        rfqNo: 'SPQM50-04012024-0004-NORMAL',
        desc: 'BALANCE WEIGHT, 3 KG',
        pno: '112.30.07.061',
        aes: 'E',
        quantity: 3,
        unitOfMeasure: 'EA',
        unitPrice: 312.33,
        totalPrice: 937.00,
        tat: 150
      }
    ],
    timestamp: new Date('2024-01-05T00:00:00').getTime(),
    lastEditedBy: {
      name: 'Admin User',
      initials: 'AD',
      timestamp: '5/1/2024 10:00AM'
    },
    statusTimeline: [
      { status: 'Draft', timestamp: '5/1/2024 9:30AM' },
      { status: 'Sent', timestamp: '5/1/2024 10:00AM' }
    ]
  },
  {
    no: 2,
    quotationNo: '20076475',
    referenceNo: '04',
    offerDate: '10/1/2023',
    validityDate: '9/4/2023',
    validityStatus: 'Expired',
    daysRemaining: -1020,
    currency: 'CHF',
    totalAmount: 2450.00,
    rfqNo: 'PA/AOG/M50/040123/EMAIL',
    lineItems: [
      {
        no: 1,
        rfqNo: 'PA/AOG/M50/040123/EMAIL',
        desc: 'KCM 200 CONFIG MODULE FRONT',
        pno: '534.56.09.053',
        aes: 'E',
        quantity: 2,
        unitOfMeasure: 'EA',
        unitPrice: 1225.00,
        totalPrice: 2450.00,
        tat: 270
      }
    ],
    timestamp: new Date('2023-01-10T00:00:00').getTime(),
    lastEditedBy: {
      name: 'John Smith',
      initials: 'JS',
      timestamp: '10/1/2023 2:00PM'
    },
    statusTimeline: [
      { status: 'Draft', timestamp: '10/1/2023 1:30PM' },
      { status: 'Sent', timestamp: '10/1/2023 2:00PM' }
    ]
  },
  {
    no: 3,
    quotationNo: '20076855',
    referenceNo: '04',
    offerDate: '3/2/2023',
    validityDate: '4/5/2023',
    validityStatus: 'Expired',
    daysRemaining: -1020,
    currency: 'CHF',
    totalAmount: 15850.00,
    rfqNo: 'PA/RO1/M50/260123/EMAIL',
    lineItems: [
      {
        no: 1,
        rfqNo: 'PA/RO1/M50/260123/EMAIL',
        desc: 'CONTACT SOCKET',
        pno: '9717516927',
        aes: 'E',
        quantity: 100,
        unitOfMeasure: 'EA',
        unitPrice: 125.50,
        totalPrice: 12550.00,
        tat: 30
      },
      {
        no: 2,
        rfqNo: 'PA/RO1/M50/260123/EMAIL',
        desc: 'BLOWER',
        pno: '5391109436',
        aes: 'E',
        quantity: 10,
        unitOfMeasure: 'EA',
        unitPrice: 330.00,
        totalPrice: 3300.00,
        tat: 270
      }
    ],
    timestamp: new Date('2023-02-03T00:00:00').getTime(),
    lastEditedBy: {
      name: 'Sarah Wilson',
      initials: 'SW',
      timestamp: '3/2/2023 11:00AM'
    },
    statusTimeline: [
      { status: 'Draft', timestamp: '3/2/2023 10:30AM' },
      { status: 'Sent', timestamp: '3/2/2023 11:00AM' }
    ]
  },
  {
    no: 4,
    quotationNo: '20076535',
    referenceNo: '04',
    offerDate: '13/1/2023',
    validityDate: '12/4/2023',
    validityStatus: 'Expired',
    daysRemaining: -1020,
    currency: 'CHF',
    totalAmount: 457.48,
    rfqNo: 'PA/NOR/M50/110123/EMAIL',
    lineItems: [
      {
        no: 1,
        rfqNo: 'PA/NOR/M50/110123/EMAIL',
        desc: 'KIT FILTER OBOGS',
        pno: '9571210607',
        aes: 'E',
        quantity: 76,
        unitOfMeasure: 'EA',
        unitPrice: 6.02,
        totalPrice: 457.48,
        tat: 270
      }
    ],
    timestamp: new Date('2023-01-13T00:00:00').getTime(),
    lastEditedBy: {
      name: 'David Lee',
      initials: 'DL',
      timestamp: '13/1/2023 3:00PM'
    },
    statusTimeline: [
      { status: 'Draft', timestamp: '13/1/2023 2:30PM' },
      { status: 'Sent', timestamp: '13/1/2023 3:00PM' }
    ]
  },
  // Additional quotations (single RFQ each) to keep list variety
  {
    no: 5,
    quotationNo: '20101128',
    referenceNo: '04',
    offerDate: '16/01/2025',
    validityDate: '16/04/2025',
    validityStatus: 'Active',
    daysRemaining: 97,
    currency: 'CHF',
    totalAmount: 4463.49,
    rfqNo: 'SPQM50-15012025-0001-RO1',
    lineItems: [
      {
        no: 1,
        rfqNo: 'SPQM50-15012025-0001-RO1',
        desc: 'HOSE ASSY',
        pno: '9599001248',
        aes: 'A',
        quantity: 1,
        unitOfMeasure: 'EA',
        unitPrice: 4463.49,
        totalPrice: 4463.49,
        tat: 60
      }
    ],
    timestamp: new Date('2025-01-16T00:00:00').getTime(),
    lastEditedBy: {
      name: 'James Brown',
      initials: 'JB',
      timestamp: '17/01/2025 10:00AM'
    },
    statusTimeline: [
      { status: 'Draft', timestamp: '17/01/2025 9:30AM' },
      { status: 'Sent', timestamp: '17/01/2025 10:00AM' }
    ]
  },
  {
    no: 6,
    quotationNo: '20101131',
    referenceNo: '04',
    offerDate: '16/01/2025',
    validityDate: '19/05/2025',
    validityStatus: 'Active',
    daysRemaining: 160,
    currency: 'CHF',
    totalAmount: 14.56,
    rfqNo: 'PA/RO2/M50/200125/EMAIL',
    lineItems: [
      {
        no: 1,
        rfqNo: 'PA/RO2/M50/200125/EMAIL',
        desc: 'PLACARD,TYRE PRESSURE',
        pno: '511.20.09.122',
        aes: 'E',
        quantity: 2,
        unitOfMeasure: 'EA',
        unitPrice: 7.28,
        totalPrice: 14.56,
        tat: 124
      }
    ],
    timestamp: new Date('2025-01-16T00:00:00').getTime(),
    lastEditedBy: {
      name: 'Rachel Green',
      initials: 'RG',
      timestamp: '17/01/2025 3:00PM'
    },
    statusTimeline: [
      { status: 'Draft', timestamp: '17/01/2025 2:30PM' },
      { status: 'Sent', timestamp: '17/01/2025 3:00PM' }
    ]
  }
]

/**
 * Flattened list for the quotation table: one row per line item (not grouped by quotation).
 * Each item has quotation-level fields plus line-level desc, pno, rfqNo, totalPrice.
 * @param {typeof INITIAL_QUOTATION_LIST} quotationList
 */
export function buildQuotationTableItems(quotationList) {
  const rows = []
  let no = 0
  for (const q of quotationList) {
    for (const line of q.lineItems) {
      no += 1
      rows.push({
        id: `${q.quotationNo}-${line.no}`,
        no,
        quotationNo: q.quotationNo,
        rfqNo: line.rfqNo,
        desc: line.desc,
        pno: line.pno,
        offerDate: q.offerDate,
        validityDate: q.validityDate,
        validityStatus: q.validityStatus,
        daysRemaining: q.daysRemaining,
        totalAmount: line.totalPrice,
        currency: q.currency,
        timestamp: q.timestamp,
        lastEditedBy: q.lastEditedBy
      })
    }
  }
  return rows
}

/** Table data: one row per individual line item */
export const INITIAL_QUOTATION_TABLE_ITEMS = buildQuotationTableItems(INITIAL_QUOTATION_LIST)
