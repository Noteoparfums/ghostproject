import crypto from 'node:crypto';
import { FUNNEL_ASSET_MATRIX } from '@ghostwriter/shared';
function hashPick(seed, arr) {
    const h = crypto.createHash('md5').update(seed).digest();
    return arr[h[0] % arr.length];
}
export function generateCopyBank(briefRaw, assetType) {
    // A simple deterministic mock generator that just returns standard copy
    // in real life we'd parse the brief JSON and use our copy banks
    const seed = briefRaw + assetType;
    const content = `Mock generated content for ${assetType}. Based on brief: ${briefRaw.substring(0, 50)}...`;
    return content;
}
const POWER_HOOKS = [
    'What if everything you were told about {topic} was wrong?',
    'The {audience} secret that turns "just browsing" into "take my money".',
    'They laughed when I launched — until the orders wouldn\'t stop.',
    'Stop guessing. Here\'s the exact system behind {topic}.',
    'The 7-word message that made {audience} finally say yes.',
    'Why smart {audience} quietly switched to this (and never looked back).',
    'You\'re one angle away from your best launch ever.',
    'The unfair advantage hiding inside your own offer.',
    'Read this before you spend another dollar on ads.',
    'How to sell {topic} without sounding like everyone else.',
];
function hooks(brief) {
    const topic = brief.product.split('.')[0].slice(0, 60);
    const aud = brief.audience || 'founders';
    return POWER_HOOKS.map((h, i) => `${i + 1}. ${h.replace('{topic}', topic).replace('{audience}', aud)}`).join('\n');
}
function paragraphs(brief, blocks) {
    const topic = brief.product.split('.')[0].slice(0, 80);
    const aud = brief.audience || 'your audience';
    return blocks
        .map((b) => b.replace(/{topic}/g, topic).replace(/{audience}/g, aud).replace(/{tone}/g, brief.tone || 'direct'))
        .join('\n\n');
}
function vslScript(brief) {
    return paragraphs(brief, [
        `[HOOK] If you're a ${brief.audience || 'founder'} trying to sell {topic}, stop scrolling for 90 seconds — because what I'm about to show you changes the math on your entire funnel.`,
        `[PROBLEM] You already know the pain: great offer, invisible results. You pour money into ads, tweak the page, rewrite the email — and still watch prospects click away. It's not your product. It's the story around it.`,
        `[AGITATE] Every day that story stays broken, a competitor with worse product and better copy eats your lunch. The gap isn't talent. It's a repeatable system for turning attention into desire.`,
        `[MECHANISM] Introducing {topic} — built on the exact five-stage structure million-dollar campaigns use: analyze the offer, find the sharpest angle, map a proven framework, draft, then polish for compliance and clarity.`,
        `[PROOF] Marketers using this approach report launches that finally convert cold traffic — because the copy speaks to the awareness stage the buyer is actually in.`,
        `[OFFER] Today you can put that same engine to work. One click builds your funnel — hooks, page, emails, upsell — in minutes, not weeks.`,
        `[SCARCITY] Founders who move first set the narrative. The ones who wait pay a copywriter $10k to say what your funnel could say tonight. Click below and generate your funnel now.`,
    ]);
}
function landingPage(brief) {
    return paragraphs(brief, [
        `# {topic}\n\n### The last thing standing between you and a launch that actually converts.`,
        `**The problem:** {audience} don't buy features. They buy a better version of themselves. If your page lists specs instead of selling transformation, you're leaving most of your revenue on the table.`,
        `**The shift:** {topic} rewrites the conversation — leading with the outcome your buyer secretly wants, handling objections before they surface, and closing with a reason to act now.`,
        `**What you get:**\n- A message matched to your buyer's awareness stage\n- Objection-handling baked into the flow\n- A CTA that feels obvious, not pushy`,
        `**Objection — "Will this work for me?"** If you have an offer and an audience, yes. The framework adapts to your angle, not the other way around.`,
        `> "It read like a $6k copywriter wrote it — in three minutes." — a very happy ${brief.audience || 'founder'}`,
        `### Ready? Start generating your funnel free. No credit card. No fluff.`,
    ]);
}
function emailSequence(brief, count) {
    const subjects = [
        'The mistake costing you sales (fix inside)',
        'I almost didn\'t send this…',
        'Last call — this closes tonight',
        'A quick story about {audience}',
        'Your unfair advantage is showing',
    ];
    const bodies = [
        `Open loop: yesterday I promised the one change that fixes conversions for {topic}. Here it is — lead with the outcome, not the feature. Reply and tell me your #1 angle.`,
        `Story: a ${brief.audience || 'founder'} came to me stuck at flat sales. We changed nothing but the angle on {topic}. The result surprised even me. More tomorrow.`,
        `Close: the doors on this close tonight. If {topic} is even a maybe, now is the moment — here's the link, no pressure, just clarity.`,
        `Value: three angles you can steal for {topic} today — fear of falling behind, aspiration of the win, and curiosity about the mechanism.`,
        `Proof + CTA: the numbers are in and they're good. If you want the same for {topic}, start here.`,
    ];
    return Array.from({ length: count })
        .map((_, i) => paragraphs(brief, [
        `**Email ${i + 1} — Subject: ${subjects[i % subjects.length].replace('{audience}', brief.audience || 'founders')}**`,
        bodies[i % bodies.length],
    ]))
        .join('\n\n---\n\n');
}
function genericBlock(brief, label) {
    return paragraphs(brief, [
        `## ${label}`,
        `Purpose-built for {audience} evaluating {topic}. This section leads with the promise, proves it fast, and removes the friction between interest and action.`,
        `- Benefit-led headline\n- One clear promise\n- Proof element\n- Single, obvious CTA`,
    ]);
}
const FRAMEWORKS = {
    ad_hooks: 'AIDA / Hook-Story-Offer — pattern-interrupt openers tuned to a Stage-{n} aware buyer.',
    vsl_script: 'Problem-Agitate-Mechanism-Proof-Offer-Scarcity — the classic long-form VSL spine.',
    landing_page: 'PAS long-form with objection-handling blocks.',
    sales_page: 'PAS long-form with objection stacking and risk reversal.',
    email_sequence: 'Soap-opera sequence — open loop → story → close.',
    optin_page: 'Curiosity-gap + single-promise opt-in.',
    thankyou_page: 'Micro-commitment + next-step framing.',
    registration_page: 'Value-stacked registration with FOMO framing.',
    pitch_outline: 'Pitch arc: problem → mechanism → offer → stack → close.',
    replay_email: 'Scarcity-driven replay reminder.',
    product_title: 'Benefit-forward title + scannable bullets.',
    description: 'Feature-to-benefit translation with sensory language.',
    ad_primary_texts: 'PAS micro-ads for cold traffic.',
    headlines: 'Curiosity + specificity headline formulas.',
    review_email: 'Reciprocity-based review request.',
    faq_block: 'Objection-handling FAQ.',
    upsell_page: 'One-time-offer logic with value anchoring.',
};
export function buildAssets(funnel, brief) {
    const assets = FUNNEL_ASSET_MATRIX[funnel];
    return assets.map((key) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        let content;
        if (key === 'ad_hooks')
            content = hooks(brief);
        else if (key === 'vsl_script')
            content = vslScript(brief);
        else if (key === 'landing_page' || key === 'sales_page' || key === 'optin_page')
            content = landingPage(brief);
        else if (key === 'email_sequence')
            content = emailSequence(brief, funnel === 'lead_magnet' ? 5 : 3);
        else
            content = genericBlock(brief, label);
        const fw = (FRAMEWORKS[key] ?? 'Direct-response best practices').replace('{n}', String(brief.awareness));
        return {
            asset_type: key,
            label,
            content,
            framework_note: `This uses ${fw} Chosen because your audience reads as Stage-${brief.awareness} aware.`,
        };
    });
}
export function buildBrief(product, audience, tone) {
    const awareness = Math.min(5, Math.max(1, Math.round(product.length / 120) % 5 || 3));
    return { product, audience, tone, offer: product.slice(0, 120), awareness };
}
//# sourceMappingURL=copyBanks.js.map