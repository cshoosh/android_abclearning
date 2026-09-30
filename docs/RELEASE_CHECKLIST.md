# Release checklist

- [ ] Replace development purchase mock with a supported Google Play Billing provider.
- [ ] Verify receipts on a trusted server, implement restore/refund handling and localized product prices.
- [ ] Create Play product `premium_lifetime`; test with license accounts and internal track.
- [ ] Confirm target API, Data Safety form, Families declarations and age/content ratings against current Play requirements.
- [ ] Review COPPA, GDPR-K and applicable regional child privacy requirements with counsel.
- [ ] Publish final privacy policy, terms, support and account deletion/request instructions.
- [ ] Keep ads disabled unless an eligible child-directed setup is reviewed, configured and declared; premium must remove any ads.
- [ ] Add licensed animal sound/music files or explicitly ship without them.
- [ ] Add production Supabase URL/anon key only if parent auth is enabled; configure email templates, redirect/domain settings and account deletion.
- [ ] Enable cloud progress sync only after data minimization, consent, retention and deletion behavior are implemented.
- [ ] Configure Android application ID, signing, store listing, privacy labels/disclosures and tablet screenshots.
- [ ] Test on actual low-cost Android phones/tablets, offline, portrait/landscape, large text and TalkBack.
- [ ] Test onboarding, parent hold gate, content locks, progress persistence, mock/real purchase, restore, cancellation, logout and reset.
- [ ] Review app dependencies, licences, accessibility, performance and crash-free behavior before launch.
