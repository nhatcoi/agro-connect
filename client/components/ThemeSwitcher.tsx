import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();

  const themes = [
    { value: 'light', label: t('common.lightMode'), icon: Sun },
    { value: 'dark', label: t('common.darkMode'), icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 w-auto min-w-[40px] h-9 px-2 flex-shrink-0"
          aria-label={currentTheme.label}
          title={currentTheme.label}
        >
          <CurrentIcon className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-28">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="cursor-pointer"
              title={themeOption.label}
            >
              <Icon className="mr-2 h-4 w-4" />
              {/* Text hidden as per request */}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
