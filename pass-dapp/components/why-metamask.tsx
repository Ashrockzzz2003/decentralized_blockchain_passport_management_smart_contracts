import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function WhyMetamask() {
    return (
        <Accordion type="single" collapsible className="mt-8 bg-slate-500 min-w-[70%] bg-opacity-35 rounded-2xl py-8 px-8">
            <AccordionItem value="item-1">
                <AccordionTrigger>What is MetaMask?</AccordionTrigger>
                <AccordionContent>
                    MetaMask provides the simplest yet most secure way to connect to blockchain-based applications. You are always in control when interacting on the new decentralized web.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Why is it best at what it does?</AccordionTrigger>
                <AccordionContent>
                    MetaMask generates passwords and keys on your device, so only you have access to your accounts and data. You always choose what to share and what to keep private.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>How do I use it?</AccordionTrigger>
                <AccordionContent>
                    Available as a browser extension and as a mobile app, MetaMask equips you with a key vault, secure login, token wallet, and token exchange—everything you need to manage your digital assets.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
