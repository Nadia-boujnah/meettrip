import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import SettingsTabs from '@/components/SettingsTabs';


const breadcrumbs = [
    {
        title: 'Paramètres d’apparence',
        href: '/parametres/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Paramètres d’apparence" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Apparence du compte"
                        description="Personnalisez le thème et les préférences d’affichage de votre compte."
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
