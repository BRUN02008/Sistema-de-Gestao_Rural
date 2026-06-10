import { Leaf, LogOut, X } from "lucide-react";
import type { MenuGroup, MenuLink, Tab } from "../../types/app";

interface MobileMenuProps {
  activeTab?: Tab;
  aberto: boolean;
  menuGroups: MenuGroup[];
  visibleMenuLinks: MenuLink[];
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (tab: Tab) => void;
}

export function MobileMenu({
  activeTab,
  aberto,
  menuGroups,
  visibleMenuLinks,
  onClose,
  onLogout,
  onNavigate,
}: MobileMenuProps) {
  if (!aberto) return null;

  const groups =
    menuGroups.length > 0
      ? menuGroups
      : [{ title: "Menu", items: visibleMenuLinks }];

  return (
    <div className="fixed inset-0 z-40 bg-[#0f241a]/60 backdrop-blur-sm lg:hidden">
      <div className="flex h-full w-[min(23rem,calc(100vw-1.25rem))] flex-col overflow-hidden bg-white shadow-2xl">
        <div className="bg-[#123d2d] px-4 py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d9efdf] text-[#123d2d]">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bce1c7]">
                  Sistema IDAM
                </p>
                <p className="font-semibold">Menu principal</p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/8 transition hover:bg-white/14"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="hide-scrollbar flex-1 space-y-5 overflow-y-auto p-4">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6d8277]">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        onNavigate(item.key);
                        onClose();
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b6b49] ${
                        isActive
                          ? "bg-[#123d2d] text-white"
                          : "text-[#263a31] hover:bg-[#edf6ed]"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block truncate">{item.label}</span>
                        {item.description && (
                          <span
                            className={`block truncate text-xs font-medium ${
                              isActive ? "text-white/70" : "text-[#607368]"
                            }`}
                          >
                            {item.description}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#edf1ed] p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
          >
            <LogOut className="h-5 w-5" />
            Sair do sistema
          </button>
        </div>
      </div>
    </div>
  );
}
