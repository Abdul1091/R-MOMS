const WarehouseTable = ({ deliveries }) => (
    <div>
        <h2 className="text-xl font-bold">Deliveries</h2>
        <table className="table-auto w-full mt-4 border border-gray-200">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Delivery ID</th>
                    <th className="border px-4 py-2">Supplier ID</th>
                    <th className="border px-4 py-2">Company Name</th>
                    <th className="border px-4 py-2">Gross Weight</th>
                    <th className="border px-4 py-2">Tare Weight</th>
                    <th className="border px-4 py-2">Net Weight</th>
                    <th className="border px-4 py-2">Quantity Received</th>
                    <th className="border px-4 py-2">Total Price</th>
                </tr>
            </thead>
            <tbody>
                {deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                        <td className="border px-4 py-2">{delivery.id}</td>
                        <td className="border px-4 py-2">{delivery.supplier_id}</td>
                        <td className="border px-4 py-2">{delivery.company_name}</td>
                        <td className="border px-4 py-2">{delivery.gross_weight}</td>
                        <td className="border px-4 py-2">{delivery.tare_weight}</td>
                        <td className="border px-4 py-2">{delivery.net_weight}</td>
                        <td className="border px-4 py-2">{delivery.quantity_received}</td>
                        <td className="border px-4 py-2">{delivery.total_price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default WarehouseTable;