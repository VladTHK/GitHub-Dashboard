import PageShell from "../widgets/layout/PageShell";
import FooterPageView from "../widgets/footer/FooterPageView";

const FooterPage = ({ page }) => {
    return (
        <PageShell>
            <FooterPageView page={page} />
        </PageShell>
    );
};

export default FooterPage;
