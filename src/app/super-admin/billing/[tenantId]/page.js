'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import apiClient from '../../../../lib/api/apiClient';

export default function TenantBillingPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId;
  
  const [tenant, setTenant] = useState(null);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tenantId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [tenantRes, billingRes] = await Promise.all([
            apiClient.get(`/super-admin/tenants/${tenantId}`),
            apiClient.get(`/super-admin/tenants/${tenantId}/billing`).catch(() => null)
          ]);
          
          setTenant(tenantRes.data.data);
          
          if (billingRes) {
            setBilling(billingRes.data.data);
          } else {
            // Mock billing data
            setBilling({
              currentPlan: {
                name: tenantRes.data.data.subscription?.plan || 'basic',
                price: tenantRes.data.data.subscription?.plan === 'premium' ? 79 : 29,
                billingCycle: 'monthly',
                status: tenantRes.data.data.subscription?.status || 'active',
                startDate: tenantRes.data.data.createdAt,
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                daysUntilRenewal: 30
              },
              paymentHistory: [
                {
                  id: 'inv_001',
                  date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  amount: 79,
                  status: 'paid',
                  description: 'Monthly subscription'
                }
              ],
              totalRevenue: 79,
              averageMonthlyRevenue: 79
            });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load billing data');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [tenantId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="text-center py-10">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Error Loading Billing</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'Tenant not found'}</p>
        <button 
          onClick={() => router.push('/super-admin/tenants')}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Back to Tenants
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => router.push('/super-admin/tenants')}
            className="mb-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Tenants
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing - {tenant.name}
          </h1>
        </div>
      </div>

      {billing && (
        <>
          {/* Current Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Current Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Plan</p>
                    <p className="text-xl font-bold text-green-900 dark:text-green-100 capitalize">
                      {billing.currentPlan.name}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Price</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                      ${billing.currentPlan.price}/{billing.currentPlan.billingCycle}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Status</p>
                    <p className="text-xl font-bold text-purple-900 dark:text-purple-100 capitalize">
                      {billing.currentPlan.status}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Next Billing</p>
                    <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                      {billing.currentPlan.daysUntilRenewal} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Revenue Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ${billing.totalRevenue}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ${billing.averageMonthlyRevenue}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Avg Monthly Revenue</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {billing.paymentHistory.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        ${payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'paid' 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {payment.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}