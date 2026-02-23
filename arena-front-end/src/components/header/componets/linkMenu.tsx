import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';

import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

interface LinkMenuProps {
  readonly hrefPage: string;
  readonly titleLinkPage: string;
  readonly forceActive?: boolean;
}

export function LinkMenu({
  hrefPage,
  titleLinkPage,
  forceActive = false,
}: LinkMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = forceActive || pathname.startsWith(hrefPage);

  return (
    <Link href={hrefPage} legacyBehavior passHref>
      <NavigationMenuLink
        onClick={() => router.push(hrefPage)}
        className={`p-2 rounded-md [&:hover]:bg-newyellow-hover [&:hover]:text-white [&:focus]:!bg-newyellow-focus [&:focus]:text-black ${navigationMenuTriggerStyle()} ${
          isActive
            ? 'bg-newyellow text-black font-medium text-sm [&:focus]:!bg-newyellow-focus [&:focus]:text-black'
            : ''
        }`}
      >
        <span className="text-sm">{titleLinkPage}</span>
      </NavigationMenuLink>
    </Link>
  );
}
