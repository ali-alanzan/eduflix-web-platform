
import { useRouter } from "next/router";

import Index from '../cancel';

const StripeCancel = ({course}) => {
    const router = useRouter();
    const { slug } = router.query;

    return (
        <Index slug={slug} />
    )

};


export default StripeCancel;