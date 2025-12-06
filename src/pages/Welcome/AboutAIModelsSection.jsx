import React from 'react';

const AboutAIModelsSection = () => {
    return (
        <section className="mt-20 w-full max-w-4xl p-6 bg-base-200 rounded-xl shadow-2xl border border-secondary/20">
            <h2 className="text-4xl font-bold text-secondary mb-6 text-center">
                About AI Models
            </h2>
            <div className="space-y-6 text-gray-300">
                <p>
                    AI Models are the core intelligence driving modern applications, ranging from image recognition (e.g., computer vision) to complex language understanding (e.g., Large Language Models or LLMs).
                </p>
                <p>
                    A model, in this context, is essentially a program that has been trained on massive amounts of data to recognize patterns and make predictions or generate content. By using our marketplace, you can quickly find pre-trained models without needing to handle the extensive training process yourself.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8 text-center">
                <div className="p-4 bg-base-300 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-primary">Pre-Trained</h3>
                    <p className="text-sm text-gray-400 mt-1">Ready to use without extensive setup.</p>
                </div>
                <div className="p-4 bg-base-300 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-primary">Variety</h3>
                    <p className="text-sm text-gray-400 mt-1">Models for Vision, Language, and Audio tasks.</p>
                </div>
                <div className="p-4 bg-base-300 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-primary">Integration</h3>
                    <p className="text-sm text-gray-400 mt-1">Easy to integrate via API keys or SDKs.</p>
                </div>
            </div>
        </section>
    );
};

export default AboutAIModelsSection;