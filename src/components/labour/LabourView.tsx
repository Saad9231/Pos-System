import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Employee, EmployeeRole, SalaryType, AttendanceRecord } from '../../types';
import { formatPKR, formatDate } from '../../utils/formatters';
import { 
  Users, 
  Plus, 
  CalendarCheck, 
  BadgeDollarSign, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2,
  X
} from 'lucide-react';

export const LabourView: React.FC = () => {
  const { 
    employees, 
    addEmployee, 
    attendance, 
    markAttendance, 
    advances, 
    issueEmployeeAdvance, 
    accounts, 
    currentUser 
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'employees' | 'attendance' | 'advances' | 'payroll'>('employees');

  // Add Employee Modal
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Lahore');
  const [role, setRole] = useState<EmployeeRole>('Carpenter');
  const [salaryType, setSalaryType] = useState<SalaryType>('Monthly');
  const [basicSalary, setBasicSalary] = useState(55000);
  const [ratePerHour, setRatePerHour] = useState(300);

  // Issue Advance Modal
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [advEmpId, setAdvEmpId] = useState(employees[0]?.id || '');
  const [advAmount, setAdvAmount] = useState(10000);
  const [advReason, setAdvReason] = useState('Emergency family support');
  const [advAccountId, setAdvAccountId] = useState(accounts[0]?.id || '');

  // Daily Attendance Form
  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>(() => {
    return employees.map(emp => {
      const existing = attendance.find(a => a.employeeId === emp.id && a.date === todayStr);
      return existing || {
        id: 'att-' + emp.id + '-' + todayStr,
        employeeId: emp.id,
        employeeName: emp.name,
        date: todayStr,
        status: 'Present',
        checkIn: '08:30 AM',
        checkOut: '05:30 PM',
        overtimeHours: 0
      };
    });
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addEmployee({
      name,
      fatherName,
      cnic,
      phone,
      address,
      role,
      salaryType,
      basicSalary: Number(basicSalary),
      ratePerHour: Number(ratePerHour),
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });

    setShowAddEmpModal(false);
  };

  const handleSaveAttendance = () => {
    markAttendance(todayRecords);
    alert('Daily attendance and overtime hours saved successfully.');
  };

  const handleIssueAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advEmpId || advAmount <= 0) return;

    issueEmployeeAdvance({
      employeeId: advEmpId,
      amount: Number(advAmount),
      reason: advReason,
      accountId: advAccountId
    });

    setShowAdvanceModal(false);
  };

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.basicSalary, 0);
  const totalAdvancesActive = advances.reduce((sum, a) => sum + a.remainingAmount, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Labour, Artisans & Payroll Management
          </h1>
          <p className="text-xs text-stone-500">
            Carpenters, polishers, upholstery masters · Attendance, advances & job costing
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['owner', 'manager'].includes(currentUser.role) && (
            <>
              <button
                onClick={() => setShowAdvanceModal(true)}
                className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Issue Advance
              </button>

              <button
                onClick={() => setShowAddEmpModal(true)}
                className="px-4 py-2 rounded-xl bg-[#8B5A2B] hover:bg-[#73461E] text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Artisan
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Total Workshop Crew</div>
          <div className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {employees.length} Artisans
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Carpenters, Polishers, Helpers</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="text-stone-400 text-xs">Monthly Basic Payroll Budget</div>
          <div className="text-xl font-black text-[#8B5A2B] dark:text-[#C58B4D] mt-1 tabular-nums">
            {formatPKR(totalMonthlyPayroll)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1A15] rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20">
          <div className="text-amber-800 dark:text-amber-300 text-xs font-semibold">Active Employee Advances</div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
            {formatPKR(totalAdvancesActive)}
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Deducted on salary payout</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 text-xs font-semibold">
        {[
          { id: 'employees', label: 'Artisans Roster', icon: Users },
          { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
          { id: 'advances', label: `Advances & Loans (${advances.length})`, icon: DollarSign },
          { id: 'payroll', label: 'Monthly Payroll Computation', icon: BadgeDollarSign }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-2.5 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeSubTab === tab.id 
                ? 'border-[#8B5A2B] text-[#8B5A2B] dark:text-[#C58B4D]' 
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSubTab === 'employees' && (
        <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Artisan Name</th>
                  <th className="p-3.5">Trade / Role</th>
                  <th className="p-3.5">Contact Phone</th>
                  <th className="p-3.5">Salary Type</th>
                  <th className="p-3.5">Basic Wage</th>
                  <th className="p-3.5">Active Advance</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#8B5A2B]">{emp.employeeNo}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-stone-900 dark:text-stone-100">{emp.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono">CNIC: {emp.cnic}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold">
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono">{emp.phone}</td>
                    <td className="p-3.5">{emp.salaryType}</td>
                    <td className="p-3.5 font-bold tabular-nums">{formatPKR(emp.basicSalary)}</td>
                    <td className="p-3.5 font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                      {emp.currentAdvancesBalance > 0 ? formatPKR(emp.currentAdvancesBalance) : 'Rs. 0'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'attendance' && (
        <div className="bg-white dark:bg-[#1E1A15] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-5 h-5 text-[#8B5A2B]" />
              <div>
                <h3 className="font-bold text-sm">Mark Daily Workshop Attendance</h3>
                <p className="text-xs text-stone-400">Date: {attendanceDate}</p>
              </div>
            </div>
            <button
              onClick={handleSaveAttendance}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-subtle"
            >
              Save Today's Attendance
            </button>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {todayRecords.map((rec, idx) => (
              <div key={rec.employeeId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">{rec.employeeName}</div>
                  <div className="text-[10px] text-stone-400">Check In: {rec.checkIn} · Check Out: {rec.checkOut}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {(['Present', 'Absent', 'Half Day', 'Leave'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => {
                          const updated = [...todayRecords];
                          updated[idx] = { ...rec, status: st };
                          setTodayRecords(updated);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          rec.status === st 
                            ? st === 'Present' ? 'bg-emerald-600 text-white' : st === 'Absent' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-stone-400">Overtime:</span>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      value={rec.overtimeHours}
                      onChange={(e) => {
                        const updated = [...todayRecords];
                        updated[idx] = { ...rec, overtimeHours: Number(e.target.value) };
                        setTodayRecords(updated);
                      }}
                      className="w-16 px-2 py-1 text-center font-bold rounded-lg bg-stone-50 dark:bg-stone-900 border"
                    />
                    <span className="text-stone-400">hrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'advances' && (
        <div className="bg-white dark:bg-[#1E1A15] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Advance #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Artisan</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Original Amount</th>
                <th className="p-3.5">Remaining Balance</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {advances.map(adv => (
                <tr key={adv.id}>
                  <td className="p-3.5 font-bold font-mono text-[#8B5A2B]">{adv.advanceNo}</td>
                  <td className="p-3.5 text-stone-500">{formatDate(adv.date)}</td>
                  <td className="p-3.5 font-bold">{adv.employeeName}</td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300">{adv.reason}</td>
                  <td className="p-3.5 font-bold tabular-nums">{formatPKR(adv.amount)}</td>
                  <td className="p-3.5 font-bold text-amber-700 dark:text-amber-400 tabular-nums">{formatPKR(adv.remainingAmount)}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {adv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'payroll' && (
        <div className="bg-white dark:bg-[#1E1A15] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-subtle space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm">Monthly Payroll Summary (Sep 2026)</h3>
              <p className="text-stone-500 text-xs">Formula: Basic + Overtime Pay − Advance Deductions = Net Payable</p>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Artisan</th>
                <th className="p-3">Basic Salary</th>
                <th className="p-3">Overtime Est.</th>
                <th className="p-3">Advance Deduction</th>
                <th className="p-3">Net Payable Wage</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {employees.map(e => {
                const estOT = (e.ratePerHour || 300) * 10;
                const advDed = Math.min(5000, e.currentAdvancesBalance);
                const netPayable = e.basicSalary + estOT - advDed;

                return (
                  <tr key={e.id}>
                    <td className="p-3 font-bold">{e.name} ({e.role})</td>
                    <td className="p-3 tabular-nums">{formatPKR(e.basicSalary)}</td>
                    <td className="p-3 text-emerald-600 font-semibold tabular-nums">+{formatPKR(estOT)}</td>
                    <td className="p-3 text-rose-600 font-semibold tabular-nums">-{formatPKR(advDed)}</td>
                    <td className="p-3 font-extrabold text-[#8B5A2B] dark:text-[#C58B4D] tabular-nums">{formatPKR(netPayable)}</td>
                    <td className="p-3 text-right">
                      <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]">
                        Pay Salary
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Advance Modal */}
      {showAdvanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm">Issue Artisan Advance / Loan</h3>
              <button onClick={() => setShowAdvanceModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleIssueAdvance} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Select Employee / Artisan *</label>
                <select
                  value={advEmpId}
                  onChange={(e) => setAdvEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role}) - Current Advance: {formatPKR(e.currentAdvancesBalance)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Advance Amount (Rs.) *</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={advAmount}
                  onChange={(e) => setAdvAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl font-bold bg-stone-50 dark:bg-stone-900 border"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Disburse From Account</label>
                <select
                  value={advAccountId}
                  onChange={(e) => setAdvAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (Bal: {formatPKR(a.balance)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason / Purpose</label>
                <textarea
                  rows={2}
                  value={advReason}
                  onChange={(e) => setAdvReason(e.target.value)}
                  placeholder="e.g. Family medical emergency, children school fees..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowAdvanceModal(false)} className="px-3 py-1.5 text-stone-500">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B5A2B] text-white font-bold">Disburse Advance</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Artisan Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1A15] rounded-2xl max-w-md w-full shadow-modal border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm">Add New Artisan / Staff</h3>
              <button onClick={() => setShowAddEmpModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Artisan Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ustad Aslam"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Trade / Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as EmployeeRole)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border"
                  >
                    <option value="Carpenter">Carpenter (Wood)</option>
                    <option value="Polisher">Polisher (PU Coating)</option>
                    <option value="Upholsterer">Upholsterer (Fabric/Foam)</option>
                    <option value="Helper">Helper / Labour</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Driver">Driver / Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">CNIC</label>
                  <input
                    type="text"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="35201-xxxxxxx-x"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Basic Monthly Salary (Rs.)</label>
                  <input
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border font-bold"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowAddEmpModal(false)} className="px-3 py-1.5 text-stone-500">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B5A2B] text-white font-bold">Save Artisan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
