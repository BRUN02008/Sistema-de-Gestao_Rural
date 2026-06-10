import { ChevronsLeftRight, Leaf } from "lucide-react";
import type { MenuGroup, Tab } from "../../types/app";

interface AppSidebarProps {
  activeTab?: Tab;
  collapsed: boolean;
  menuGroups: MenuGroup[];
  onNavigate: (tab: Tab) => void;
  onToggleCollapsed: () => void;
}

export function AppSidebar({
  activeTab,
  collapsed,
  menuGroups,
  onNavigate,
  onToggleCollapsed,
}: AppSidebarProps) {
  return (
    <aside
      className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-[#d7e0d7] bg-[#123d2d] text-white shadow-xl shadow-[#123d2d]/10 transition-[width] duration-200 lg:block ${
        collapsed ? "w-[5.25rem]" : "w-80"
      }`}
      aria-label="Menu principal"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 p-3">
          <div
            className={`flex items-center gap-3 rounded-lg bg-white/8 p-3 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#d9efdf] text-[#123d2d]">
              <Leaf className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bce1c7]">
                  Sistema IDAM
                </p>
                <p className="truncate text-sm font-semibold text-white/90">
                  Gestão agropecuária
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className="hide-scrollbar flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#92b8a2]">
                  {group.title}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      title={collapsed ? item.label : undefined}
                      onClick={() => onNavigate(item.key)}
                      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9efdf] ${
                        isActive
                          ? "bg-white text-[#123d2d] shadow-sm"
                          : "text-white/78 hover:bg-white/10 hover:text-white"
                      } ${collapsed ? "justify-center" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition ${
                          isActive
                            ? "bg-[#d9efdf] text-[#123d2d]"
                            : "bg-white/8 text-[#d9efdf] group-hover:bg-white/14"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      {!collapsed && (
                        <span className="min-w-0">
                          <span className="block truncate">{item.label}</span>
                          {item.description && (
                            <span
                              className={`block truncate text-xs font-medium ${
                                isActive ? "text-[#486657]" : "text-white/48"
                              }`}
                            >
                              {item.description}
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={`flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/8 px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/12 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9efdf] ${
              collapsed ? "justify-center" : ""
            }`}
            aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          >
            <ChevronsLeftRight className="h-4 w-4" />
            {!collapsed && <span>Recolher menu</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
