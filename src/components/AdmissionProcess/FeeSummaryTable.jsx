import React from "react";

const feeData = [
    {
        "id": 6,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "June",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 7,
                        "fee_type": "Exam Fee",
                        "amount": "450.00"
                    },
                    {
                        "id": 8,
                        "fee_type": "Transport Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "1450.00",
        "paid_amount": "1400.00",
        "due_amount": "50.00",
        "payment_date": "2025-06-04",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "39ccfb01ee204761acba210e8fbd0b71",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "Paid Tuition,Exam, and Transport Fee",
        "signature": "Account Officer"
    },
    {
        "id": 7,
        "student": {
            "id": 2,
            "name": "Zaianb Ali"
        },
        "month": "June",
        "year_level_fees_grouped": [],
        "total_amount": "2800.00",
        "paid_amount": "2200.00",
        "due_amount": "300.00",
        "payment_date": "2025-06-05",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "Paid admission and tution fee",
        "signature": "Accounts Office"
    },
    {
        "id": 8,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "June",
        "year_level_fees_grouped": [],
        "total_amount": "1300.00",
        "paid_amount": "1000.00",
        "due_amount": "-2700.00",
        "payment_date": "2025-06-05",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "FNX4J2J1PK",
        "late_fee": "0.00",
        "payment_status": "Paid",
        "remarks": "Paid tution and exam fee",
        "signature": "Accountant"
    },
    {
        "id": 9,
        "student": {
            "id": 4,
            "name": "Adil Khan"
        },
        "month": "July",
        "year_level_fees_grouped": [],
        "total_amount": "2800.00",
        "paid_amount": "1000.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-05",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "CTIYVDTS6P",
        "late_fee": "0.00",
        "payment_status": "Paid",
        "remarks": "Paid on time",
        "signature": "Accounts Office"
    },
    {
        "id": 10,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "May",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "500.00",
        "paid_amount": "500.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-10",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "97Z5PSHO0P",
        "late_fee": "0.00",
        "payment_status": "",
        "remarks": "Paid May fee",
        "signature": "Accounts"
    },
    {
        "id": 11,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "July",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "500.00",
        "paid_amount": "500.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-10",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "VNTBM090VT",
        "late_fee": "0.00",
        "payment_status": "",
        "remarks": "Paid July fee",
        "signature": "Accounts"
    },
    {
        "id": 12,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "Oct",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "500.00",
        "paid_amount": "500.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-10",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "G0S2H0TCRK",
        "late_fee": "0.00",
        "payment_status": "",
        "remarks": "Oct fees",
        "signature": "Accounts Office"
    },
    {
        "id": 13,
        "student": {
            "id": 4,
            "name": "Adil Khan"
        },
        "month": "June",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "500.00",
        "paid_amount": "500.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-10",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "G5JAOWDNPS",
        "late_fee": "0.00",
        "payment_status": "",
        "remarks": "Paid June month fee",
        "signature": "Accounts"
    },
    {
        "id": 14,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "May",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "500.00",
        "paid_amount": "500.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-11",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "BF15OFTGP8",
        "late_fee": "0.00",
        "payment_status": "",
        "remarks": "May fees",
        "signature": "Accounts Office"
    },
    {
        "id": 15,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "July",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "500.00",
        "paid_amount": "500.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-11",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "P5LJ0H8ONW",
        "late_fee": "0.00",
        "payment_status": "",
        "remarks": "Paid July fee",
        "signature": "Accounts"
    },
    {
        "id": 16,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "Jan",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "2500.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-11",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "UH2K70KZU4",
        "late_fee": "0.00",
        "payment_status": "",
        "remarks": "kjflskdfjsdlk",
        "signature": "hasnen ali"
    },
    {
        "id": 17,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "January",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    }
                ]
            }
        ],
        "total_amount": "2000.00",
        "paid_amount": "55.00",
        "due_amount": "1945.00",
        "payment_date": "2025-06-11",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "CGIF8JCUT6",
        "late_fee": "0.00",
        "payment_status": "",
        "remarks": "ff",
        "signature": "dd"
    },
    {
        "id": 18,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "August",
        "year_level_fees_grouped": [
            {
                "year_level": "KG-1",
                "fees": [
                    {
                        "id": 10,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "500.00",
        "paid_amount": "500.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-11",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "0SKE0JBGV5",
        "late_fee": "0.00",
        "payment_status": "Paid",
        "remarks": "Paid May fee",
        "signature": "Accounts"
    },
    {
        "id": 19,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "February",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "55.00",
        "due_amount": "2445.00",
        "payment_date": "2025-06-12",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "NFYPJRM97X",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "45",
        "signature": "fff"
    },
    {
        "id": 20,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "March",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "44.00",
        "due_amount": "2456.00",
        "payment_date": "2025-06-12",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "80J8UPY393",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "55",
        "signature": "250"
    },
    {
        "id": 21,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "April",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 3,
                        "fee_type": "Exam Fee",
                        "amount": "400.00"
                    }
                ]
            }
        ],
        "total_amount": "2900.00",
        "paid_amount": "44.00",
        "due_amount": "2856.00",
        "payment_date": "2025-06-12",
        "payment_mode": "Cheque",
        "is_cheque_cleared": false,
        "receipt_number": "WAC4097DJX",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "55",
        "signature": "250"
    },
    {
        "id": 22,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "September",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "500.00",
        "due_amount": "2000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "PJ0HN2DFSP",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "Hasnen ali",
        "signature": "Hasnen ali"
    },
    {
        "id": 23,
        "student": {
            "id": 1,
            "name": "Saba Ansari"
        },
        "month": "December",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "500.00",
        "due_amount": "2000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "BZG0UCQSND",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "hasnen"
    },
    {
        "id": 24,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "October",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 3,
                        "fee_type": "Exam Fee",
                        "amount": "400.00"
                    }
                ]
            }
        ],
        "total_amount": "2900.00",
        "paid_amount": "800.00",
        "due_amount": "2100.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "3XMOAFIZVJ",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "Hasnen ali"
    },
    {
        "id": 25,
        "student": {
            "id": 2,
            "name": "Zaianb Ali"
        },
        "month": "May",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 5,
                        "fee_type": "Admission Fee",
                        "amount": "2500.00"
                    },
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "3000.00",
        "paid_amount": "0.00",
        "due_amount": "3000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "SU1Z4DMZOD",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "Hasnen ali"
    },
    {
        "id": 26,
        "student": {
            "id": 2,
            "name": "Zaianb Ali"
        },
        "month": "July",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 5,
                        "fee_type": "Admission Fee",
                        "amount": "2500.00"
                    },
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "3000.00",
        "paid_amount": "0.00",
        "due_amount": "3000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "WNN980A22C",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "Hasnen ali"
    },
    {
        "id": 27,
        "student": {
            "id": 2,
            "name": "Zaianb Ali"
        },
        "month": "August",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 5,
                        "fee_type": "Admission Fee",
                        "amount": "2500.00"
                    },
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "3000.00",
        "paid_amount": "0.00",
        "due_amount": "3000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "GGG9MCEVFI",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "Hasnen ali"
    },
    {
        "id": 28,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "March",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 5,
                        "fee_type": "Admission Fee",
                        "amount": "2500.00"
                    },
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "3000.00",
        "paid_amount": "0.00",
        "due_amount": "3000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "PPDS39O003",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "Hasnen ali"
    },
    {
        "id": 29,
        "student": {
            "id": 5,
            "name": "Tuba Khalid"
        },
        "month": "January",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "0.00",
        "due_amount": "2500.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "6L9EY7EBT0",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "Hasnen ali"
    },
    {
        "id": 30,
        "student": {
            "id": 6,
            "name": "Fozia Khan"
        },
        "month": "January",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 5,
                        "fee_type": "Admission Fee",
                        "amount": "2500.00"
                    },
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "3000.00",
        "paid_amount": "0.00",
        "due_amount": "3000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "AXWOGYLSG2",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "ggggg"
    },
    {
        "id": 31,
        "student": {
            "id": 2,
            "name": "Zaianb Ali"
        },
        "month": "October",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "500.00",
        "due_amount": "2000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "DTSK6K72PF",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "Hasnen ali",
        "signature": "Hasnen ali"
    },
    {
        "id": 32,
        "student": {
            "id": 2,
            "name": "Zaianb Ali"
        },
        "month": "November",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "500.00",
        "due_amount": "2000.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "UZ30EBC5YY",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "Hasnen ali",
        "signature": "Hasnen ali"
    },
    {
        "id": 33,
        "student": {
            "id": 5,
            "name": "Tuba Khalid"
        },
        "month": "August",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "400.00",
        "due_amount": "2100.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "AP0H6GT8TT",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "ff"
    },
    {
        "id": 34,
        "student": {
            "id": 5,
            "name": "Tuba Khalid"
        },
        "month": "November",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "400.00",
        "due_amount": "2100.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "118WWUUHQ5",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "ff"
    },
    {
        "id": 35,
        "student": {
            "id": 5,
            "name": "Tuba Khalid"
        },
        "month": "April",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "455.00",
        "due_amount": "2045.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "64UT85TL29",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "fff",
        "signature": "ff"
    },
    {
        "id": 36,
        "student": {
            "id": 6,
            "name": "Fozia Khan"
        },
        "month": "August",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "455.00",
        "due_amount": "2045.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "UV99159I41",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "7888"
    },
    {
        "id": 37,
        "student": {
            "id": 7,
            "name": "Sania Ali"
        },
        "month": "August",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "455.00",
        "due_amount": "2045.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "EUXLOOO9ON",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "7888"
    },
    {
        "id": 38,
        "student": {
            "id": 4,
            "name": "Adil Khan"
        },
        "month": "May",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 3,
                        "fee_type": "Exam Fee",
                        "amount": "400.00"
                    }
                ]
            }
        ],
        "total_amount": "2900.00",
        "paid_amount": "455.00",
        "due_amount": "2445.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "B6KCDFGBYF",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "7888"
    },
    {
        "id": 39,
        "student": {
            "id": 7,
            "name": "Sania Ali"
        },
        "month": "September",
        "year_level_fees_grouped": [
            {
                "year_level": "KG-1",
                "fees": [
                    {
                        "id": 9,
                        "fee_type": "Admission Fee",
                        "amount": "3000.00"
                    },
                    {
                        "id": 10,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 11,
                        "fee_type": "Exam Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "4000.00",
        "paid_amount": "800.00",
        "due_amount": "3200.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "JU8YLCRG1N",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "kjkj"
    },
    {
        "id": 40,
        "student": {
            "id": 7,
            "name": "Sania Ali"
        },
        "month": "October",
        "year_level_fees_grouped": [
            {
                "year_level": "KG-1",
                "fees": [
                    {
                        "id": 9,
                        "fee_type": "Admission Fee",
                        "amount": "3000.00"
                    },
                    {
                        "id": 10,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 11,
                        "fee_type": "Exam Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "4000.00",
        "paid_amount": "800.00",
        "due_amount": "3200.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "KKQQMWMXZX",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "kjkj"
    },
    {
        "id": 41,
        "student": {
            "id": 4,
            "name": "Adil Khan"
        },
        "month": "October",
        "year_level_fees_grouped": [
            {
                "year_level": "KG-1",
                "fees": [
                    {
                        "id": 9,
                        "fee_type": "Admission Fee",
                        "amount": "3000.00"
                    },
                    {
                        "id": 10,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 11,
                        "fee_type": "Exam Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "4000.00",
        "paid_amount": "450.00",
        "due_amount": "3550.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "IYFL356I3Y",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "kjkj"
    },
    {
        "id": 42,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "December",
        "year_level_fees_grouped": [
            {
                "year_level": "Class-1",
                "fees": [
                    {
                        "id": 17,
                        "fee_type": "Admission Fee",
                        "amount": "4000.00"
                    },
                    {
                        "id": 18,
                        "fee_type": "Tuition Fee",
                        "amount": "550.00"
                    }
                ]
            }
        ],
        "total_amount": "4550.00",
        "paid_amount": "400.00",
        "due_amount": "4150.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "754LCUETQ7",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "fff",
        "signature": "fff"
    },
    {
        "id": 43,
        "student": {
            "id": 5,
            "name": "Tuba Khalid"
        },
        "month": "September",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "520.00",
        "due_amount": "1980.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "HTUKXHNFLV",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "dkfjdk",
        "signature": "hasnen"
    },
    {
        "id": 44,
        "student": {
            "id": 5,
            "name": "Tuba Khalid"
        },
        "month": "October",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "520.00",
        "due_amount": "1980.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "X7EQAVMO0W",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "dkfjdk",
        "signature": "hasnen"
    },
    {
        "id": 45,
        "student": {
            "id": 7,
            "name": "Sania Ali"
        },
        "month": "November",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 3,
                        "fee_type": "Exam Fee",
                        "amount": "400.00"
                    }
                ]
            }
        ],
        "total_amount": "2400.00",
        "paid_amount": "520.00",
        "due_amount": "1880.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "AUKTQEK50A",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "520",
        "signature": "hasnen"
    },
    {
        "id": 46,
        "student": {
            "id": 6,
            "name": "Fozia Khan"
        },
        "month": "November",
        "year_level_fees_grouped": [
            {
                "year_level": "KG-2",
                "fees": [
                    {
                        "id": 13,
                        "fee_type": "Admission Fee",
                        "amount": "3500.00"
                    },
                    {
                        "id": 14,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "4000.00",
        "paid_amount": "600.00",
        "due_amount": "3400.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "PWJ9CZPYQX",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "fff",
        "signature": "hhh"
    },
    {
        "id": 47,
        "student": {
            "id": 6,
            "name": "Fozia Khan"
        },
        "month": "December",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 5,
                        "fee_type": "Admission Fee",
                        "amount": "2500.00"
                    },
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "3000.00",
        "paid_amount": "700.00",
        "due_amount": "2300.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "JZKE4Y2SK3",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "gg",
        "signature": "ggg"
    },
    {
        "id": 48,
        "student": {
            "id": 4,
            "name": "Adil Khan"
        },
        "month": "April",
        "year_level_fees_grouped": [
            {
                "year_level": "KG-1",
                "fees": [
                    {
                        "id": 9,
                        "fee_type": "Admission Fee",
                        "amount": "3000.00"
                    },
                    {
                        "id": 10,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "3500.00",
        "paid_amount": "800.00",
        "due_amount": "2700.00",
        "payment_date": "2025-06-13",
        "payment_mode": "Cheque",
        "is_cheque_cleared": false,
        "receipt_number": "OS5824A5RK",
        "late_fee": "0.00",
        "payment_status": "Unpaid",
        "remarks": "500",
        "signature": "jjj"
    },
    {
        "id": 49,
        "student": {
            "id": 6,
            "name": "Fozia Khan"
        },
        "month": "July",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "450.00",
        "due_amount": "2075.00",
        "payment_date": "2025-06-16",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "05028I554C",
        "late_fee": "25.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "hasnen ali"
    },
    {
        "id": 50,
        "student": {
            "id": 6,
            "name": "Fozia Khan"
        },
        "month": "October",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "850.00",
        "due_amount": "1675.00",
        "payment_date": "2025-06-16",
        "payment_mode": "Cheque",
        "is_cheque_cleared": false,
        "receipt_number": "6WL87LPU9R",
        "late_fee": "25.00",
        "payment_status": "Unpaid",
        "remarks": "Hasnen ali",
        "signature": "Hasnen ali"
    },
    {
        "id": 51,
        "student": {
            "id": 7,
            "name": "Sania Ali"
        },
        "month": "January",
        "year_level_fees_grouped": [
            {
                "year_level": "Pre-Nursery",
                "fees": [
                    {
                        "id": 1,
                        "fee_type": "Admission Fee",
                        "amount": "2000.00"
                    },
                    {
                        "id": 2,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "2500.00",
        "paid_amount": "850.00",
        "due_amount": "1675.00",
        "payment_date": "2025-06-16",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "8VUGN751E3",
        "late_fee": "25.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "hhh"
    },
    {
        "id": 52,
        "student": {
            "id": 7,
            "name": "Sania Ali"
        },
        "month": "March",
        "year_level_fees_grouped": [
            {
                "year_level": "Nursery",
                "fees": [
                    {
                        "id": 5,
                        "fee_type": "Admission Fee",
                        "amount": "2500.00"
                    },
                    {
                        "id": 6,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "3000.00",
        "paid_amount": "500.00",
        "due_amount": "2525.00",
        "payment_date": "2025-06-16",
        "payment_mode": "Online",
        "is_cheque_cleared": false,
        "receipt_number": "2UI1R1WZ7S",
        "late_fee": "25.00",
        "payment_status": "Unpaid",
        "remarks": null,
        "signature": "Hasnen ali"
    },
    {
        "id": 53,
        "student": {
            "id": 4,
            "name": "Adil Khan"
        },
        "month": "December",
        "year_level_fees_grouped": [
            {
                "year_level": "KG-2",
                "fees": [
                    {
                        "id": 13,
                        "fee_type": "Admission Fee",
                        "amount": "3500.00"
                    },
                    {
                        "id": 14,
                        "fee_type": "Tuition Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 15,
                        "fee_type": "Exam Fee",
                        "amount": "500.00"
                    },
                    {
                        "id": 16,
                        "fee_type": "Transport Fee",
                        "amount": "500.00"
                    }
                ]
            }
        ],
        "total_amount": "5000.00",
        "paid_amount": "5000.00",
        "due_amount": "25.00",
        "payment_date": "2025-06-16",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "YALM5UBR47",
        "late_fee": "25.00",
        "payment_status": "Unpaid",
        "remarks": "hasnen",
        "signature": "Hasnen ali"
    },
    {
        "id": 54,
        "student": {
            "id": 4,
            "name": "Adil Khan"
        },
        "month": "September",
        "year_level_fees_grouped": [
            {
                "year_level": "Class-1",
                "fees": [
                    {
                        "id": 17,
                        "fee_type": "Admission Fee",
                        "amount": "4000.00"
                    },
                    {
                        "id": 18,
                        "fee_type": "Tuition Fee",
                        "amount": "550.00"
                    }
                ]
            }
        ],
        "total_amount": "4550.00",
        "paid_amount": "500.00",
        "due_amount": "4075.00",
        "payment_date": "2025-06-16",
        "payment_mode": "Cash",
        "is_cheque_cleared": false,
        "receipt_number": "0RSRMH8IKW",
        "late_fee": "25.00",
        "payment_status": "Unpaid",
        "remarks": "hasnen",
        "signature": "Hasnen ali"
    },
    {
        "id": 55,
        "student": {
            "id": 3,
            "name": "Rabia Khan"
        },
        "month": "November",
        "year_level_fees_grouped": [
            {
                "year_level": "Class-1",
                "fees": [
                    {
                        "id": 18,
                        "fee_type": "Tuition Fee",
                        "amount": "550.00"
                    },
                    {
                        "id": 19,
                        "fee_type": "Exam Fee",
                        "amount": "550.00"
                    }
                ]
            }
        ],
        "total_amount": "1100.00",
        "paid_amount": "1125.00",
        "due_amount": "0.00",
        "payment_date": "2025-06-16",
        "payment_mode": "Cheque",
        "is_cheque_cleared": false,
        "receipt_number": "QYCSTU3H8D",
        "late_fee": "25.00",
        "payment_status": "Unpaid",
        "remarks": "Hasnen ali",
        "signature": "Hasnen ali"
    },
];

function FeeSummaryTable() {
  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-lg max-w-screen mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Student Fee Record
          <i className="fa-solid fa-cloud ml-2 text-blue-500"></i>
        </h1>
        
        <div className="overflow-x-auto my-6 rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">ID</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Student</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Month</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Year Level</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Fees</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Total Amount</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Paid Amount</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Due Amount</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Payment Date</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Payment Mode</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Receipt No.</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Status</th>
                <th className="p-3 text-left font-semibold text-gray-700 border border-gray-200">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {feeData.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50">
                  <td className="p-3 border border-gray-200">{record.id}</td>
                  <td className="p-3 border border-gray-200">{record.student.name}</td>
                  <td className="p-3 border border-gray-200">{record.month}</td>
                  <td className="p-3 border border-gray-200">
                    {record.year_level_fees_grouped.map(level => level.year_level).join(', ') || 'N/A'}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {record.year_level_fees_grouped.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {record.year_level_fees_grouped[0].fees.map(fee => (
                          <li key={fee.id}>{fee.fee_type}: ₹{fee.amount}</li>
                        ))}
                      </ul>
                    ) : 'N/A'}
                  </td>
                  <td className="p-3 border border-gray-200">₹{record.total_amount}</td>
                  <td className="p-3 border border-gray-200">₹{record.paid_amount}</td>
                  <td className="p-3 border border-gray-200">₹{record.due_amount}</td>
                  <td className="p-3 border border-gray-200">{record.payment_date}</td>
                  <td className="p-3 border border-gray-200">{record.payment_mode}</td>
                  <td className="p-3 border border-gray-200">{record.receipt_number || 'N/A'}</td>
                  <td className="p-3 border border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.payment_status === 'Paid' ? 'bg-green-100 text-green-800' :
                      record.payment_status === 'Unpaid' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.payment_status}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-200">{record.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FeeSummaryTable;