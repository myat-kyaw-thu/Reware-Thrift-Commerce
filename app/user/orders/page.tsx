import Pagination from "@/components/shared/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Orders",
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string; }>;
}) => {
  const { page } = await props.searchParams;

  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
            Orders
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-slate-600 to-slate-400 dark:from-slate-400 dark:to-slate-300 rounded-full"></div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-600">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase px-4 sm:px-6 py-4">
                    ID
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase px-4 sm:px-6 py-4">
                    Date
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase px-4 sm:px-6 py-4">
                    Total
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase px-4 sm:px-6 py-4">
                    Paid
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase px-4 sm:px-6 py-4">
                    Delivered
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase px-4 sm:px-6 py-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((order, index) => (
                  <TableRow
                    key={order.id}
                    className={`
                      border-b border-slate-100 dark:border-slate-700/50 
                      transition-all duration-300 ease-in-out
                      ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-25 dark:bg-slate-800/30"}
                    `}
                  >
                    <TableCell className="px-4 sm:px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs">
                        {formatId(order.id)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatDateTime(order.createdAt).dateTime}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(order.totalPrice.toString())}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                      {order.isPaid && order.paidAt ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Paid
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {formatDateTime(order.paidAt).dateTime}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          Not Paid
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                      {order.isDelivered && order.deliveredAt ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            Delivered
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {formatDateTime(order.deliveredAt).dateTime}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                          Not Delivered
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-sm">
                      <Link href={`/order/${order.id}`}>
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium transition-all duration-200 ease-in-out transform active:scale-95">
                          Details
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {orders.totalPages > 1 && (
            <div className="px-4 sm:px-6 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700">
              <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
