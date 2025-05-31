export interface Bills {
    id?: number;
    type: string;
    number: string;
    oldIndex: any;
    newIndex: any;
    amountConsumed: any;
    invoiceDate: string;
    dueDate: string;
    paymentValue: string;
    apartmentsCode: string;
    status?: string;
    pdf?: any;
}