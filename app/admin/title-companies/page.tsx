import { getTitleCompanies } from './actions';
import TitleCompanyList from './TitleCompanyList';

export const dynamic = 'force-dynamic';

export default async function TitleCompaniesPage() {
    const companies = await getTitleCompanies();

    return (
        <TitleCompanyList initialCompanies={companies} />
    );
}
