// Mock data for BizSight ERP
// In a real application, this would come from a database.

export const totalRevenue = 125032.89;
export const totalExpenses = 78450.21;
export const totalProfit = totalRevenue - totalExpenses;

export const appointments = [
    { id: '1', time: '9:00 AM', title: 'Meeting with John Doe' },
    { id: '2', time: '11:00 AM', title: 'Client Call - Acme Corp' },
    { id: '3', time: '2:00 PM', title: 'Design Review' },
];

export const recentTransactions = [
    {
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        amount: "+$1,999.00",
        avatar: "https://picsum.photos/seed/2/40/40",
    },
    {
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        amount: "+$39.00",
        avatar: "https://picsum.photos/seed/3/40/40",
    },
    {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        amount: "+$299.00",
        avatar: "https://picsum.photos/seed/4/40/40",
    },
    {
        name: "William Kim",
        email: "will@email.com",
        amount: "+$99.00",
        avatar: "https://picsum.photos/seed/5/40/40",
    },
    {
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        amount: "+$39.00",
        avatar: "https://picsum.photos/seed/6/40/40",
    },
];

export const overviewChartData = [
  { name: 'Jan', total: 1100 },
  { name: 'Feb', total: 2800 },
  { name: 'Mar', total: 1500 },
  { name: 'Apr', total: 3200 },
  { name: 'May', total: 1800 },
  { name: 'Jun', total: 4500 },
  { name: 'Jul', total: 2600 },
  { name: 'Aug', total: 3900 },
  { name: 'Sep', total: 2300 },
  { name: 'Oct', total: 4100 },
  { name: 'Nov', total: 3500 },
  { name: 'Dec', total: 5200 },
]

export type Revenue = {
    id: string
    source: string
    amount: number
    date: string
    status: "paid" | "pending" | "overdue"
}

export const revenueData: Revenue[] = [
    { id: 'REV001', source: 'Acme Inc.', amount: 2500, date: '2024-07-01', status: 'paid' },
    { id: 'REV002', source: 'Stark Industries', amount: 5000, date: '2024-07-05', status: 'paid' },
    { id: 'REV003', source: 'Wayne Enterprises', amount: 1200, date: '2024-07-10', status: 'pending' },
    { id: 'REV004', source: 'Cyberdyne Systems', amount: 800, date: '2024-06-20', status: 'overdue' },
    { id: 'REV005', source: 'Globex Corporation', amount: 3200, date: '2024-07-15', status: 'paid' },
];

export type Expense = {
    id: string
    vendor: string
    category: string
    amount: number
    date: string
}

export const expenseData: Expense[] = [
    { id: 'EXP001', vendor: 'Office Supplies Co.', category: 'Office Supplies', amount: 150, date: '2024-07-02' },
    { id: 'EXP002', vendor: 'Cloud Services Inc.', category: 'Software', amount: 300, date: '2024-07-01' },
    { id: 'EXP003', vendor: 'Gourmet Catering', category: 'Meals & Entertainment', amount: 450, date: '2024-07-08' },
    { id: 'EXP004', vendor: 'TravelBookings.com', category: 'Travel', amount: 1200, date: '2024-06-25' },
    { id: 'EXP005', vendor: 'Marketing Agency', category: 'Marketing', amount: 2500, date: '2024-07-12' },
]
