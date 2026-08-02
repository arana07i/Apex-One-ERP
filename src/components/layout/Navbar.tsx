import React, { useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  User as UserIcon,
  Check,
  Layers,
  Terminal,
} from 'lucide-react';
import { User, Role } from '../../types';
import { Badge } from '../common/Badge';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (u: User) => void;
  onOpenCommandPalette: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenCommandPalette,
  darkMode,
  onToggleDarkMode,
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case Role.Admin: return 'purple';
      case Role.WarehouseManager: return 'info';
      case Role.InventorySpecialist: return 'success';
      case Role.Auditor: return 'warning';
      case Role.ProcurementLead: return 'danger';
      default: return 'default';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Brand logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold shadow-xs">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-sm text-zinc-900 dark:text-zinc-100">
              APEX ONE ERP
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
              SaaS v1.0
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
            Enterprise Clean Architecture Platform
          </div>
        </div>
      </div>

      {/* Middle: Command Search Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-9 px-3 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-lg flex items-center justify-between text-xs text-zinc-400 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-zinc-400" />
            <span>Search SKUs, warehouses, POs or command...</span>
          </span>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={onOpenCommandPalette}
          className="p-2 md:hidden text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Engine Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Connected</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          title="Toggle Light/Dark Theme"
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Persona / RBAC Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden font-medium text-xs text-zinc-700 dark:text-zinc-200">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                {currentUser.name}
              </div>
              <div className="mt-0.5">
                <Badge variant={getRoleBadgeVariant(currentUser.role)} size="sm">
                  {currentUser.role}
                </Badge>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>

          {/* Persona Menu Overlay */}
          {showPersonaMenu && (
            <div
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 animate-in fade-in duration-150"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/30">
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Switch Active Persona (RBAC)
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Test permissions & view constraints instantly.
                </div>
              </div>

              <div className="py-1">
                {allUsers.map(user => {
                  const isActive = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                        isActive ? 'bg-zinc-50 dark:bg-zinc-800/50 font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-3.5 h-3.5 text-zinc-500 m-1" />
                          )}
                        </div>
                        <div>
                          <div className="text-zinc-900 dark:text-zinc-100 font-medium">{user.name}</div>
                          <div className="text-[10px] text-zinc-400">{user.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                          {user.role}
                        </Badge>
                        {isActive && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
