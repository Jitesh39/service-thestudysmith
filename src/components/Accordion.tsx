"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface AccordionProps {
    items: FAQItem[];
}

export default function Accordion({ items }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col gap-2">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`accordion-item ${openIndex === index ? "active" : ""}`}
                >
                    <button
                        suppressHydrationWarning={true}
                        className="accordion-trigger"
                        onClick={() => toggle(index)}
                        aria-expanded={openIndex === index}
                    >
                        {item.question}
                        {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div className="accordion-content">
                        <p>{item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
