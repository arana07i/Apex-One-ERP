import React, { useState } from 'react';
import { Warehouse as WarehouseIcon, MapPin, User, Layers, Plus, HardDrive, Shield } from 'lucide-react';
import { Warehouse } from '../types';
import { formatNumber } from '../lib/utils';
import { Badge } from '../components/common/Badge';

interface WarehouseViewProps {
  warehouses: Warehouse[];
  onOpenCreateWarehouse: () => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({ warehouses, onOpenCreateWarehouse }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Warehouse Logistics Hubs & Zone Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Monitor physical warehouse capacity, zone allocation, cold-chain areas, and bin layouts.
          </p>
        </div>
        <button
          onClick={onOpenCreateWarehouse}
          className="px-3.5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Provision Warehouse Hub</span>
        </button>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map(wh => {
          const usedPct = Math.round((wh.currentUsedUnits / wh.totalCapacityUnits) * 100);

          return (
            <div
              key={wh.id}
              className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-bold">
                      <WarehouseIcon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {wh.code}
                      </div>
                      <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {wh.name}
                      </div>
                    </div>
                  </div>
                  <Badge variant={usedPct > 85 ? 'danger' : 'info'} size="sm">
                    {usedPct}% Capacity Used
                  </Badge>
                </div>

                {/* Location & Manager */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="line-clamp-1">{wh.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Manager: <strong className="text-zinc-800 dark:text-zinc-200">{wh.managerName}</strong></span>
                  </div>
                </div>

                {/* Capacity Gauge */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Storage Capacity</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {formatNumber(wh.currentUsedUnits)} / {formatNumber(wh.totalCapacityUnits)} units
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        usedPct > 85 ? 'bg-rose-500' : usedPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${usedPct}%` }}
                    />
                  </div>
                </div>

                {/* Zones Breakdown */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    Storage Zones & Bins
                  </div>
                  <div className="space-y-1.5">
                    {wh.zones.map(zone => (
                      <div
                        key={zone.id}
                        className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 mr-2">
                            {zone.code}
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400">{zone.name}</span>
                        </div>
                        <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                          {zone.binCount} Bins
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Provisioned: {wh.createdAt.slice(0, 10)}</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">Active Node</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
