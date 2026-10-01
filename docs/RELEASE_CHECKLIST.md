# Release checklist

- [x] Create Play subscription `abc_friends_premium` with Pakistan-only monthly (PKR 200) and annual (PKR 1,500) base plans; configure the RevenueCat `premium_access` entitlement and `default` offering.
- [ ] Add the Google Play Developer API service-account connection to RevenueCat. The public Android SDK key is configured locally; it must be available to the release build environment.
- [x] Publish version 1 (1.0.0) to the Play internal testing track and include the `home` tester list.
- [ ] Complete a Play-installed test purchase after RevenueCat credentials validate; the web opt-in is confirmed for `cshoosh@gmail.com`.
- [x] Connect the RevenueCat webhook to `https://api.abcfriends.021labs.online/webhooks/revenuecat` and receive a signed sandbox test event with HTTP 200.
- [ ] Test verified purchase, restore, cancel, pending payment, renewal, expiry, refund/revocation and offline/recovery using license accounts and the internal track.
- [ ] Confirm target API, Data Safety form, Families declarations and age/content ratings against current Play requirements.
- [ ] Review COPPA, GDPR-K and applicable regional child privacy requirements with counsel.
- [ ] Publish the final privacy policy, terms, support contact and instructions for clearing information saved on the device.
- [ ] Complete AdMob account verification, publisher payments, consent message, child-appropriate blocking controls and Ad Review Center checks; review privacy/store disclosures and legal requirements for each launch market.
- [ ] Confirm the Android AdMob app review/approval and ad unit IDs; verify ads stay inside the Parent Gate and do not appear in child activities. Keep iOS ads disabled.
- [ ] Verify active Premium removes the parent-dashboard ad and no ad is shown before subscription status has been checked.
- [ ] Before commercial release, replace the Stable Audio Basic-tier music, interface effects and animal cues with outputs covered by commercial-use terms or obtain written permission. Stable Audio's current terms permit commercial apps under 100,000 monthly active users on Pro and require Enterprise above that threshold; verify the terms at release time.
- [ ] Keep source and license credits for the animal calls and generated audio; see `assets/sounds/README.md`, `assets/music/README.md` and `docs/THIRD_PARTY_NOTICES.md`.
- [ ] Configure Android application ID, signing, store listing, privacy labels/disclosures and tablet screenshots.
- [ ] Test on actual low-cost Android phones/tablets, offline, portrait/landscape, large text and TalkBack.
- [ ] Test onboarding, parent hold gate, content locks, progress persistence, verified subscription, restore, cancellation and reset.
- [ ] Review app dependencies, licences, accessibility, performance and crash-free behavior before launch.
