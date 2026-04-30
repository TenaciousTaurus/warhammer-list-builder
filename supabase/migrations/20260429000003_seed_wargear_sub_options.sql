INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'a3f9ea18-7ce1-19fb-f48a-2a24ee701c58', '7e8766c2-fbc6-a030-16db-6a7858313d92', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '7e8766c2-fbc6-a030-16db-6a7858313d92')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'b43b99a9-8f07-4855-28e3-6f9545ef1302', 'd014eb8e-3cb4-2c8c-67d6-ce003e45aa2d', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd014eb8e-3cb4-2c8c-67d6-ce003e45aa2d')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '4e671018-47c7-2e2a-b563-cea001e69278', '2d9b097e-75d5-22ce-aa03-a1f2cff8785c', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2d9b097e-75d5-22ce-aa03-a1f2cff8785c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'bbead0eb-1673-b539-c94a-881694345336', '53da33a6-0006-05ce-b1aa-09d0897f24cd', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '53da33a6-0006-05ce-b1aa-09d0897f24cd')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '1fad182b-896e-8f16-9df2-02bccb40f213', '39ac8678-a84e-e873-e75a-a39580ea1b35', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '39ac8678-a84e-e873-e75a-a39580ea1b35')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'db4f9923-ed2b-7f93-2c11-84f2cd236487', '909a075a-4e11-d266-26d2-1eb6e668cc54', 'Meltagun', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '909a075a-4e11-d266-26d2-1eb6e668cc54')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'd8f25b05-4ab1-cee7-3004-fdffec7c1003', '909a075a-4e11-d266-26d2-1eb6e668cc54', 'Questoris heavy stubber', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '909a075a-4e11-d266-26d2-1eb6e668cc54')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '36f4153c-e3ac-6195-6986-86b06c446cc9', '08185f70-f0d3-8d41-c8f6-55098b9d9d9a', 'Meltagun', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '08185f70-f0d3-8d41-c8f6-55098b9d9d9a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'efd3b1f4-6235-26fd-d814-3313c023a2cc', '08185f70-f0d3-8d41-c8f6-55098b9d9d9a', 'Questoris heavy stubber', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '08185f70-f0d3-8d41-c8f6-55098b9d9d9a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '226e0a97-6299-e234-5171-448aa94fe93f', '084bb9c7-c605-7f27-43a8-4b3c3c82bf76', 'Twin Icarus autocannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '084bb9c7-c605-7f27-43a8-4b3c3c82bf76')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'e34cda87-c380-2f4b-4135-766a80eee789', '084bb9c7-c605-7f27-43a8-4b3c3c82bf76', 'Ironstorm missile pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '084bb9c7-c605-7f27-43a8-4b3c3c82bf76')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '10530cb0-6a63-2b1c-2674-16dda8197db8', '084bb9c7-c605-7f27-43a8-4b3c3c82bf76', 'Stormspear rocket pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '084bb9c7-c605-7f27-43a8-4b3c3c82bf76')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '1ad6ab4c-80b9-c963-5faa-d2011c51f282', '0b0d7328-8b7d-6b4e-c6e5-e222c94ea046', 'Meltagun', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '0b0d7328-8b7d-6b4e-c6e5-e222c94ea046')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '84a50541-260e-fe06-a21f-cb68f33e14f7', '0b0d7328-8b7d-6b4e-c6e5-e222c94ea046', 'Questoris heavy stubber', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '0b0d7328-8b7d-6b4e-c6e5-e222c94ea046')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '5e18cf1b-ff9f-f122-4e8c-7c3a16d70f88', 'e51e5ca2-3477-1c1d-a403-5181515d430a', 'Reaper chainsword', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'e51e5ca2-3477-1c1d-a403-5181515d430a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '1b85aefc-c270-3d19-6796-3715835def1d', 'e51e5ca2-3477-1c1d-a403-5181515d430a', 'Thunderstrike gauntlet', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'e51e5ca2-3477-1c1d-a403-5181515d430a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'eda232be-2cfc-d2a6-ac5a-c3108e76f087', 'fab8444e-3a6b-ca6c-deaa-4afd3a8e08be', 'Twin Icarus autocannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'fab8444e-3a6b-ca6c-deaa-4afd3a8e08be')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '8d5a32b7-ef28-a078-c84d-00de02576564', 'fab8444e-3a6b-ca6c-deaa-4afd3a8e08be', 'Ironstorm missile pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'fab8444e-3a6b-ca6c-deaa-4afd3a8e08be')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '69ace7bc-8b8d-1235-e768-5e5ef85d9f12', 'fab8444e-3a6b-ca6c-deaa-4afd3a8e08be', 'Stormspear rocket pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'fab8444e-3a6b-ca6c-deaa-4afd3a8e08be')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '2af15b42-f735-0cdf-e431-354ac2f7e25a', '3f3f97b8-a715-ed73-200c-f592716a772f', 'Meltagun', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '3f3f97b8-a715-ed73-200c-f592716a772f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '046969a0-7939-6e8f-867a-e4ea7b4b98b4', '3f3f97b8-a715-ed73-200c-f592716a772f', 'Questoris heavy stubber', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '3f3f97b8-a715-ed73-200c-f592716a772f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '1d5730b8-4bb9-fa5f-40f0-37ce811b21fa', '39a3ba03-5b28-319a-ed16-6fe6f37c6f04', 'Reaper chainsword', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '39a3ba03-5b28-319a-ed16-6fe6f37c6f04')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '30f375a6-33aa-a5bb-06d2-b4057fe3033e', '39a3ba03-5b28-319a-ed16-6fe6f37c6f04', 'Thunderstrike gauntlet', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '39a3ba03-5b28-319a-ed16-6fe6f37c6f04')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '04f451f2-ea67-1a75-5b70-33e9937f446a', 'e6da80e5-4f17-36c4-2496-4a2b40eb50e6', 'Twin Icarus autocannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'e6da80e5-4f17-36c4-2496-4a2b40eb50e6')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'a5e5bd2a-dc9a-7289-1552-b8838c9a72bc', 'e6da80e5-4f17-36c4-2496-4a2b40eb50e6', 'Ironstorm missile pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'e6da80e5-4f17-36c4-2496-4a2b40eb50e6')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '3f10e396-51b2-0b77-4f41-d6f33e85e41e', 'e6da80e5-4f17-36c4-2496-4a2b40eb50e6', 'Stormspear rocket pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'e6da80e5-4f17-36c4-2496-4a2b40eb50e6')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'a05a2bbb-44cf-d248-047e-7c95aa0d3f30', '1293d33a-4d6f-b252-778e-8402aeda5537', 'Meltagun', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '1293d33a-4d6f-b252-778e-8402aeda5537')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'fd881bec-4b8c-e394-6985-0d9c8d6a9ec5', '1293d33a-4d6f-b252-778e-8402aeda5537', 'Questoris heavy stubber', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '1293d33a-4d6f-b252-778e-8402aeda5537')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '9622094c-c6e8-d2b4-5578-a76311742911', 'b9c5ca29-3d8c-f2f8-a3f1-a2a2ede91de5', 'Twin Icarus autocannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'b9c5ca29-3d8c-f2f8-a3f1-a2a2ede91de5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '0d350f4a-e95b-11ea-7866-38f88301db42', 'b9c5ca29-3d8c-f2f8-a3f1-a2a2ede91de5', 'Ironstorm missile pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'b9c5ca29-3d8c-f2f8-a3f1-a2a2ede91de5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '8157fda1-23ea-68a8-a708-639982412286', 'b9c5ca29-3d8c-f2f8-a3f1-a2a2ede91de5', 'Stormspear rocket pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'b9c5ca29-3d8c-f2f8-a3f1-a2a2ede91de5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ea65cf34-f710-942b-081b-ffe807be8450', '70acecc7-3206-859d-2e62-a2c9865d8436', 'Meltagun', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '70acecc7-3206-859d-2e62-a2c9865d8436')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ea18ff79-b196-bdda-3789-f24e8ab056bd', '70acecc7-3206-859d-2e62-a2c9865d8436', 'Questoris heavy stubber', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '70acecc7-3206-859d-2e62-a2c9865d8436')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '4aa9bdea-6779-59ea-4073-5e288c4881f0', '282b35f0-5c7f-4ce8-84cb-867e39c2dcbf', 'Reaper chainsword', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '282b35f0-5c7f-4ce8-84cb-867e39c2dcbf')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'b4de72a6-3f94-1f08-c4aa-d29668769158', '282b35f0-5c7f-4ce8-84cb-867e39c2dcbf', 'Thunderstrike gauntlet', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '282b35f0-5c7f-4ce8-84cb-867e39c2dcbf')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '1b0e70e4-bf92-ed8d-d821-112a164a021b', '08778b26-5344-5cd0-780c-059f34a4c446', 'Twin Icarus autocannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '08778b26-5344-5cd0-780c-059f34a4c446')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'cb73e90b-1d6d-1d2f-746c-23d9bd077c92', '08778b26-5344-5cd0-780c-059f34a4c446', 'Ironstorm missile pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '08778b26-5344-5cd0-780c-059f34a4c446')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'c7a0e20f-3516-46ac-f69c-20f177220c6c', '08778b26-5344-5cd0-780c-059f34a4c446', 'Stormspear rocket pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '08778b26-5344-5cd0-780c-059f34a4c446')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '962b49f8-40cb-96b1-55b3-948b692934eb', 'bc6060b0-2746-630a-4971-f02b43c20892', 'Meltagun', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'bc6060b0-2746-630a-4971-f02b43c20892')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '55a8fd2c-f0c0-d2a1-4107-40bfc18c8c8d', 'bc6060b0-2746-630a-4971-f02b43c20892', 'Questoris heavy stubber', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'bc6060b0-2746-630a-4971-f02b43c20892')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '33f72a8f-41eb-7dc8-1dec-48a4803f299e', 'd5d17570-988d-4c6f-043f-bbe9eb7cda96', 'Twin Icarus autocannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd5d17570-988d-4c6f-043f-bbe9eb7cda96')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '9dfdd14e-9db0-879e-43a9-7ea002239197', 'd5d17570-988d-4c6f-043f-bbe9eb7cda96', 'Ironstorm missile pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd5d17570-988d-4c6f-043f-bbe9eb7cda96')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '2fc0097c-286b-dbe5-986f-d8448f049f39', 'd5d17570-988d-4c6f-043f-bbe9eb7cda96', 'Stormspear rocket pod', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd5d17570-988d-4c6f-043f-bbe9eb7cda96')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '441b8257-bd2f-e7b1-79c7-7c9a1c1fa296', 'aa29fb6a-6413-77a3-b500-7d665e6f5421', 'Reaper chainsword', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'aa29fb6a-6413-77a3-b500-7d665e6f5421')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '9e368b62-94de-ff13-c69a-1b5ba96ee045', 'aa29fb6a-6413-77a3-b500-7d665e6f5421', 'Thunderstrike gauntlet', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'aa29fb6a-6413-77a3-b500-7d665e6f5421')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '3a8126fb-fdbb-5bd8-c6f1-6c306a7d209f', 'cc4e13b1-9e67-c343-7394-8970df1a3810', '2 shieldbreaker missile launchers and twin siegebreaker cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'cc4e13b1-9e67-c343-7394-8970df1a3810')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '3eff3f20-3a48-ff5d-6d7f-60e27f4f507e', 'cc4e13b1-9e67-c343-7394-8970df1a3810', 'Shieldbreaker missile launcher and 2 twin siegebreaker cannons', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'cc4e13b1-9e67-c343-7394-8970df1a3810')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'cc34c48b-3d16-ef7c-86de-5600b160eb20', '17c6b3c0-c20d-73de-7183-eef2396ee08f', '2 shieldbreaker missile launchers and twin siegebreaker cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '17c6b3c0-c20d-73de-7183-eef2396ee08f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'cb328e0c-721d-c601-628d-80c474b1853a', '17c6b3c0-c20d-73de-7183-eef2396ee08f', 'Shieldbreaker missile launcher and 2 twin siegebreaker cannons', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '17c6b3c0-c20d-73de-7183-eef2396ee08f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '49b86858-5b0f-aa9a-5c06-5bea9fe75ee9', '77e05758-de3a-c5be-1b29-1647e456190f', 'Missile Launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '77e05758-de3a-c5be-1b29-1647e456190f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '45db0274-e06a-4ab0-f6db-43ec4a245c6b', '77e05758-de3a-c5be-1b29-1647e456190f', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '77e05758-de3a-c5be-1b29-1647e456190f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'd7442501-9bcc-59f7-9964-52f914701f63', '77e05758-de3a-c5be-1b29-1647e456190f', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '77e05758-de3a-c5be-1b29-1647e456190f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '83d2e467-c0bc-3bf2-bd23-ac068285c9b5', '77e05758-de3a-c5be-1b29-1647e456190f', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '77e05758-de3a-c5be-1b29-1647e456190f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'deb0874c-17a2-d28a-bf70-9f9fc977c87e', '77e05758-de3a-c5be-1b29-1647e456190f', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '77e05758-de3a-c5be-1b29-1647e456190f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '34da0cf0-7b98-993b-8b43-d328e76e8a8d', '07ad84d3-23f6-9691-e35e-368e18ec661f', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '07ad84d3-23f6-9691-e35e-368e18ec661f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '267b50ba-7552-e6f4-e26f-297afd6470e9', '07ad84d3-23f6-9691-e35e-368e18ec661f', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '07ad84d3-23f6-9691-e35e-368e18ec661f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '341df29a-65e1-7079-e968-ce0d114a926c', '07ad84d3-23f6-9691-e35e-368e18ec661f', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '07ad84d3-23f6-9691-e35e-368e18ec661f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '7159f1db-70af-44d8-9d7a-ba3ffed320b4', '07ad84d3-23f6-9691-e35e-368e18ec661f', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '07ad84d3-23f6-9691-e35e-368e18ec661f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '5e295e73-fcce-30d0-0660-8b881a1090dc', '07ad84d3-23f6-9691-e35e-368e18ec661f', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '07ad84d3-23f6-9691-e35e-368e18ec661f')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'fd826240-ebaa-6ef9-b440-d6858619adfa', '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '66241e66-0370-5735-2053-4cde8c4b3133', '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '0ce90a2f-9167-2a34-31ee-5d004eabcd5f', '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'f2fed3c8-e8bd-5d42-6e26-df33243cf074', '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '53370fd5-a6fe-89de-f9f4-86e8cd1bdf84', '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '32bc5c2b-ddbf-fc84-07ed-83ae82bd5541')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '8ce4772d-f6e1-ab89-9f1f-d6ea1c8f9ee2', 'f478798c-23ee-cca6-48ef-753829e9ec92', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'f478798c-23ee-cca6-48ef-753829e9ec92')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '04c41688-0c61-4dfd-fc49-74317f7847a2', 'f478798c-23ee-cca6-48ef-753829e9ec92', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'f478798c-23ee-cca6-48ef-753829e9ec92')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '2c73b987-b216-f477-0f01-dd09373da57b', 'f478798c-23ee-cca6-48ef-753829e9ec92', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'f478798c-23ee-cca6-48ef-753829e9ec92')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'c29dd034-2537-85f6-3fad-db53b2cbff9b', 'f478798c-23ee-cca6-48ef-753829e9ec92', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'f478798c-23ee-cca6-48ef-753829e9ec92')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '49febc43-a35b-6521-fef4-93a95dc6d748', 'f478798c-23ee-cca6-48ef-753829e9ec92', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'f478798c-23ee-cca6-48ef-753829e9ec92')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'e56e3ea8-cd75-81d6-3e2d-bc651b1648d5', 'a1098b45-ae57-42b6-0744-82ba612cbbe5', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'a1098b45-ae57-42b6-0744-82ba612cbbe5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '8e37a2e6-649f-5c23-11c8-8e4958fd7f66', 'a1098b45-ae57-42b6-0744-82ba612cbbe5', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'a1098b45-ae57-42b6-0744-82ba612cbbe5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '4738d07e-4915-cf04-15aa-79b7e2e6e0b2', 'a1098b45-ae57-42b6-0744-82ba612cbbe5', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'a1098b45-ae57-42b6-0744-82ba612cbbe5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '98cc6016-3671-cc03-0bf4-f052e900d9f8', 'a1098b45-ae57-42b6-0744-82ba612cbbe5', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'a1098b45-ae57-42b6-0744-82ba612cbbe5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'd0a801c2-e552-a7f4-02e7-6fc4f93b34b8', 'a1098b45-ae57-42b6-0744-82ba612cbbe5', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'a1098b45-ae57-42b6-0744-82ba612cbbe5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '7714e9f5-3142-f19f-c8ca-bcb30a09f345', '50638506-168c-fb89-d33e-a3a0c4759694', 'Missile Launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '50638506-168c-fb89-d33e-a3a0c4759694')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '2d6e2bf4-f21e-f3d4-d98f-ead2c4f66737', '50638506-168c-fb89-d33e-a3a0c4759694', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '50638506-168c-fb89-d33e-a3a0c4759694')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '6dd4f95e-1736-1f64-e7a9-2dfc59f94ca0', '50638506-168c-fb89-d33e-a3a0c4759694', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '50638506-168c-fb89-d33e-a3a0c4759694')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'bd39a30d-5a27-f508-3cbc-2c2c0752186c', '50638506-168c-fb89-d33e-a3a0c4759694', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '50638506-168c-fb89-d33e-a3a0c4759694')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '2e570bce-a7f0-ae0c-0f25-0614f9075055', '50638506-168c-fb89-d33e-a3a0c4759694', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '50638506-168c-fb89-d33e-a3a0c4759694')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'b4f02db7-1d04-f383-424a-79f55d635eff', '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'c3ff66c3-9bf6-c453-25f0-8bed736753e7', '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '88044563-8273-9831-0512-7bf2db4e9e9a', '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '5af97c11-d6cc-eda6-5f23-a570af84c678', '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'a03623f9-960a-2ddd-cdda-572b988a6341', '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2fcef1b4-0a0b-9786-adce-c5a5357cdd6b')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '980451dc-af21-cb43-7236-4e9dc343e708', '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '0c22a7e6-0ef9-b85b-59e1-2d82dcea9468', '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'd0bd6f30-806d-8538-3cc5-f46d363002eb', '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '700a654a-0f57-cec6-be2c-b1fa4c858c4f', '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '8e8e4abd-5aaf-fbea-9130-0ed6a2a7554b', '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '04e6d4d1-b050-ca01-bdac-9ec827aa3cc9')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '586f460a-0a6d-01c9-16c9-ee6465e5ec15', 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ac91bb7a-d5c8-37a8-9ade-eb30bf4da3b3', 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'c19a2126-9c51-22d6-5dcd-ced9847e9428', 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'aa5c273a-03b8-feee-9a03-15d9a671ae66', 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '6dffdf0d-988f-f913-d33c-0817ef07db50', 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'd034477a-f7f1-616d-32a6-dfe9c8fdd6da')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '6e9e9ac8-ce6b-ed5e-f3f5-3f9b4c0faf7b', '65a3f684-54fb-a54c-0199-1e8979bf030c', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '65a3f684-54fb-a54c-0199-1e8979bf030c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '92c565c8-545a-53c9-d765-5f66b9c44ac5', '65a3f684-54fb-a54c-0199-1e8979bf030c', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '65a3f684-54fb-a54c-0199-1e8979bf030c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '0b449d0c-798b-d135-ee99-a9bb29868519', '65a3f684-54fb-a54c-0199-1e8979bf030c', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '65a3f684-54fb-a54c-0199-1e8979bf030c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '0f793146-30d2-3391-0319-fc3ffa81cd28', '65a3f684-54fb-a54c-0199-1e8979bf030c', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '65a3f684-54fb-a54c-0199-1e8979bf030c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '579313e6-5803-7fa9-0c9a-03274a60d6b0', '65a3f684-54fb-a54c-0199-1e8979bf030c', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '65a3f684-54fb-a54c-0199-1e8979bf030c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'f6299262-7020-3ee4-e4f8-b40b1bb13814', '2accc9f2-8941-6d0c-6766-8872f3de582c', 'Missile Launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2accc9f2-8941-6d0c-6766-8872f3de582c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '25f1559a-8eaf-871c-8c13-dbdc7382ddc4', '2accc9f2-8941-6d0c-6766-8872f3de582c', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2accc9f2-8941-6d0c-6766-8872f3de582c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '86cc99db-6a28-10e8-d3d2-24f148f36442', '2accc9f2-8941-6d0c-6766-8872f3de582c', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2accc9f2-8941-6d0c-6766-8872f3de582c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '7f0991ce-33d1-381d-ce62-2151e9b4478e', '2accc9f2-8941-6d0c-6766-8872f3de582c', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2accc9f2-8941-6d0c-6766-8872f3de582c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '23f5dd9d-b16e-c880-d953-06f678801653', '2accc9f2-8941-6d0c-6766-8872f3de582c', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '2accc9f2-8941-6d0c-6766-8872f3de582c')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '68429973-b73f-7492-4d2c-345443c0218c', '11e3f121-a63a-cedc-237f-8e2134e5d82e', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '11e3f121-a63a-cedc-237f-8e2134e5d82e')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '16a75c45-e09f-6c4c-b868-338fc7f2684b', '11e3f121-a63a-cedc-237f-8e2134e5d82e', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '11e3f121-a63a-cedc-237f-8e2134e5d82e')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'bd9b5f1c-9b36-7f55-5787-3d80ebad9d89', '11e3f121-a63a-cedc-237f-8e2134e5d82e', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '11e3f121-a63a-cedc-237f-8e2134e5d82e')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '9d264dd3-82cb-79e8-cd58-d1962b570f9e', '11e3f121-a63a-cedc-237f-8e2134e5d82e', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '11e3f121-a63a-cedc-237f-8e2134e5d82e')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ee0c28f4-92cd-c194-efc7-5da49f23c7c0', '11e3f121-a63a-cedc-237f-8e2134e5d82e', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '11e3f121-a63a-cedc-237f-8e2134e5d82e')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '22496903-91be-0dd8-1fc2-869bce9b826d', '51ba94b6-207a-28db-dec1-d72818e195f2', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '51ba94b6-207a-28db-dec1-d72818e195f2')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '29c6d553-047f-64c4-4a91-778295efc008', '51ba94b6-207a-28db-dec1-d72818e195f2', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '51ba94b6-207a-28db-dec1-d72818e195f2')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '04a8ac66-7063-7f63-e6b3-afa608598abe', '51ba94b6-207a-28db-dec1-d72818e195f2', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '51ba94b6-207a-28db-dec1-d72818e195f2')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '0def5be5-5a0c-f9b8-32e6-b6572a0d2f0f', '51ba94b6-207a-28db-dec1-d72818e195f2', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '51ba94b6-207a-28db-dec1-d72818e195f2')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '5876d01d-0712-ba5a-79ba-3b9dbee88d59', '51ba94b6-207a-28db-dec1-d72818e195f2', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '51ba94b6-207a-28db-dec1-d72818e195f2')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'fa6b9a36-7f9a-bb6c-e8b7-876d99bc8d5c', '67730cc0-ba8f-6c18-e35b-1da332cfe68a', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '67730cc0-ba8f-6c18-e35b-1da332cfe68a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'c7b02296-bc10-d916-9619-2ab556804e96', '67730cc0-ba8f-6c18-e35b-1da332cfe68a', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '67730cc0-ba8f-6c18-e35b-1da332cfe68a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '4109e3c7-d3ee-5e0f-a5b3-421ab00dc525', '67730cc0-ba8f-6c18-e35b-1da332cfe68a', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '67730cc0-ba8f-6c18-e35b-1da332cfe68a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'a4a56f31-6a66-fa21-6de2-064dbf5044e9', '67730cc0-ba8f-6c18-e35b-1da332cfe68a', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '67730cc0-ba8f-6c18-e35b-1da332cfe68a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '7a1401bf-fcc5-e848-9a14-da835e3e9f75', '67730cc0-ba8f-6c18-e35b-1da332cfe68a', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '67730cc0-ba8f-6c18-e35b-1da332cfe68a')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '30156985-30a5-dbe1-7485-ab628f626e0b', '0e055d14-52d0-3053-76a8-bdd0cb959473', 'Aeldari missile launcher', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '0e055d14-52d0-3053-76a8-bdd0cb959473')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '62f3400c-5bfa-f038-0998-4a9eba48bc86', '0e055d14-52d0-3053-76a8-bdd0cb959473', 'Bright Lance', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '0e055d14-52d0-3053-76a8-bdd0cb959473')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '99368caf-0b66-0499-2b63-25c9617558e4', '0e055d14-52d0-3053-76a8-bdd0cb959473', 'Scatter Laser', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '0e055d14-52d0-3053-76a8-bdd0cb959473')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'da6b3989-5055-ec53-5599-bc257f127900', '0e055d14-52d0-3053-76a8-bdd0cb959473', 'Starcannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '0e055d14-52d0-3053-76a8-bdd0cb959473')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'cd12c20a-a1ad-2691-0e53-b7e88de62066', '0e055d14-52d0-3053-76a8-bdd0cb959473', 'Shuriken Cannon', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '0e055d14-52d0-3053-76a8-bdd0cb959473')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'b9dd6ff2-4e3a-5768-b54f-e716e536f89c', '6fdfdaba-7bd4-94be-b3bb-105d4e28f90b', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '6fdfdaba-7bd4-94be-b3bb-105d4e28f90b')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'c4a96c79-79cd-575b-e0f3-66020796a283', 'c90b499f-aedf-5bd1-e9a9-f20605f38151', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'c90b499f-aedf-5bd1-e9a9-f20605f38151')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ad0880e0-1381-5edf-7699-683ae274af85', '1b6a7505-4d45-0fe4-456b-6ee635549228', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '1b6a7505-4d45-0fe4-456b-6ee635549228')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '10dc720a-08af-7d53-c4ce-458e3787bd73', '3535f387-1b0e-e460-3e76-5d0b52d15bba', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '3535f387-1b0e-e460-3e76-5d0b52d15bba')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'c3f703d2-5968-fb57-e83d-3f990f124a37', '5d7d775b-74cc-cab0-02cd-3d64046c5893', 'Hunter-killer missile', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '5d7d775b-74cc-cab0-02cd-3d64046c5893')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'b8c9d1da-56cc-a7b3-97fc-70de3c7127cb', '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '9d997e2d-c5db-c828-9f88-269ddaf88b8a', '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'b0677b52-6e21-29b1-35a3-126b46e7e8fb', '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'bff35939-609b-09b7-cdc4-9863dab495d6', '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333', 'Guardian Drone', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '5bfa1dee-ed71-ead4-df55-99da814d80e1', '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '6bbf4e2c-49cd-f9d6-e4e0-a77eb06e2333')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ad538ae5-f0a2-6d20-f270-0c2d8ccb4a4b', '5c26398f-1f9c-9d48-0540-de40e48ca8c5', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '5c26398f-1f9c-9d48-0540-de40e48ca8c5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '9e6b01b3-2112-c0e1-cd12-5e0671cf0f9a', '5c26398f-1f9c-9d48-0540-de40e48ca8c5', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '5c26398f-1f9c-9d48-0540-de40e48ca8c5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '67dc7313-3647-fa1d-c96a-6f1c03605f9d', '5c26398f-1f9c-9d48-0540-de40e48ca8c5', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '5c26398f-1f9c-9d48-0540-de40e48ca8c5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '26928e82-59b7-c796-2e56-2e2dba6392be', '5c26398f-1f9c-9d48-0540-de40e48ca8c5', 'Guardian Drone', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '5c26398f-1f9c-9d48-0540-de40e48ca8c5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'b69a0561-ed6d-d165-837e-9d794aa626ea', '5c26398f-1f9c-9d48-0540-de40e48ca8c5', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '5c26398f-1f9c-9d48-0540-de40e48ca8c5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '61c2dca9-e5cc-d403-6809-f7121f1e5b7a', '369e2611-802e-d901-b26c-c68049580918', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '369e2611-802e-d901-b26c-c68049580918')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '58fdeb98-f30b-5b9d-601b-af7a213f673c', '369e2611-802e-d901-b26c-c68049580918', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '369e2611-802e-d901-b26c-c68049580918')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'd957eabb-fa94-7e78-899a-09024afc8abe', '369e2611-802e-d901-b26c-c68049580918', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '369e2611-802e-d901-b26c-c68049580918')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '2178525c-58a3-a0bd-c98d-df60227fb2e5', '369e2611-802e-d901-b26c-c68049580918', 'Guardian Drone', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '369e2611-802e-d901-b26c-c68049580918')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '3b18a963-5aa5-017d-d799-af677ec262ec', '369e2611-802e-d901-b26c-c68049580918', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '369e2611-802e-d901-b26c-c68049580918')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '8c461778-aa3e-6c46-cd1c-eaad5d47ac78', '83b0abd8-9482-fe30-7183-cfff77bba5d6', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '83b0abd8-9482-fe30-7183-cfff77bba5d6')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'c58554cd-86d9-0ed6-10a0-0aea3fe04223', '83b0abd8-9482-fe30-7183-cfff77bba5d6', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '83b0abd8-9482-fe30-7183-cfff77bba5d6')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '771866b0-d33b-8423-ead1-97b76f624f44', '83b0abd8-9482-fe30-7183-cfff77bba5d6', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '83b0abd8-9482-fe30-7183-cfff77bba5d6')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'd3c62c5b-d4a1-d13c-aca4-6a4777f11907', '83b0abd8-9482-fe30-7183-cfff77bba5d6', 'Guardian Drone', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '83b0abd8-9482-fe30-7183-cfff77bba5d6')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '7deeb3cf-5d07-e9da-bd90-11300263e77d', '83b0abd8-9482-fe30-7183-cfff77bba5d6', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '83b0abd8-9482-fe30-7183-cfff77bba5d6')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'b5322353-57c7-0561-4be8-d6f71aece6a1', '87344c9d-c1fc-0f85-d62d-a7a9999f0800', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '87344c9d-c1fc-0f85-d62d-a7a9999f0800')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '7693717c-6884-b65c-b00c-c99a172fd833', '87344c9d-c1fc-0f85-d62d-a7a9999f0800', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '87344c9d-c1fc-0f85-d62d-a7a9999f0800')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '6c800d52-d984-bcf0-0c9c-ebab948670ea', '87344c9d-c1fc-0f85-d62d-a7a9999f0800', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '87344c9d-c1fc-0f85-d62d-a7a9999f0800')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '3b3c6bc2-815b-8b7b-d4a0-efa08a3339fd', '87344c9d-c1fc-0f85-d62d-a7a9999f0800', 'Guardian Drone', 1, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '87344c9d-c1fc-0f85-d62d-a7a9999f0800')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '8eb3575c-14b1-7a28-856f-78303c035ec5', '87344c9d-c1fc-0f85-d62d-a7a9999f0800', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '87344c9d-c1fc-0f85-d62d-a7a9999f0800')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'a33f9c5b-21fb-5ae2-7984-957137e46524', 'b74f04fd-1b37-5148-0e69-0259c3a187eb', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'b74f04fd-1b37-5148-0e69-0259c3a187eb')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '664ec0f7-5cf5-9a22-4dd5-c4f7aa0145e0', 'b74f04fd-1b37-5148-0e69-0259c3a187eb', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'b74f04fd-1b37-5148-0e69-0259c3a187eb')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ec15da68-1149-19e8-7d76-385e736f9ba1', 'b74f04fd-1b37-5148-0e69-0259c3a187eb', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'b74f04fd-1b37-5148-0e69-0259c3a187eb')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ed7e90cb-0cc1-b047-7abe-363ebde24acb', 'b74f04fd-1b37-5148-0e69-0259c3a187eb', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = 'b74f04fd-1b37-5148-0e69-0259c3a187eb')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '6839a07d-7929-c8b1-2ce9-c031ca7af3c0', '81041ff7-75ed-71a7-4189-3bb8604468a5', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '81041ff7-75ed-71a7-4189-3bb8604468a5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '1b3159fb-b48e-e0dc-b549-e4dafdf1bb67', '81041ff7-75ed-71a7-4189-3bb8604468a5', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '81041ff7-75ed-71a7-4189-3bb8604468a5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '0d7fbe35-a9ea-b7ce-c9cb-40b51b89906b', '81041ff7-75ed-71a7-4189-3bb8604468a5', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '81041ff7-75ed-71a7-4189-3bb8604468a5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '3dea254b-d6e8-f1fc-633a-47fe9cde4d47', '81041ff7-75ed-71a7-4189-3bb8604468a5', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '81041ff7-75ed-71a7-4189-3bb8604468a5')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ebe7fda3-0ce0-d046-29da-d0c76efddb4d', '46791545-54e7-9bdf-7101-3d9ec6143202', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '46791545-54e7-9bdf-7101-3d9ec6143202')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'e6a396cf-67bf-a519-661b-b4d60b0bcb83', '46791545-54e7-9bdf-7101-3d9ec6143202', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '46791545-54e7-9bdf-7101-3d9ec6143202')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'a60077d8-fc78-7016-2880-a11f48780fee', '46791545-54e7-9bdf-7101-3d9ec6143202', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '46791545-54e7-9bdf-7101-3d9ec6143202')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '2db86d31-19b0-c6b8-3729-73e23bfeb04c', '46791545-54e7-9bdf-7101-3d9ec6143202', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '46791545-54e7-9bdf-7101-3d9ec6143202')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '47724482-d9c7-4c85-4c8c-6cb61ae533d0', '25917772-a927-056a-bcb8-9976fc43ce04', 'Gun Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '25917772-a927-056a-bcb8-9976fc43ce04')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'ba1f65db-564e-50c1-8329-8c8a51c28792', '25917772-a927-056a-bcb8-9976fc43ce04', 'Missile Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '25917772-a927-056a-bcb8-9976fc43ce04')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT '5af0b0aa-a8f3-34af-9c74-8681ec4006a0', '25917772-a927-056a-bcb8-9976fc43ce04', 'Marker Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '25917772-a927-056a-bcb8-9976fc43ce04')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;

INSERT INTO public.wargear_sub_options (id, wargear_option_id, name, max_count, points)
SELECT 'd8d04634-4113-1527-e1aa-003b4a857714', '25917772-a927-056a-bcb8-9976fc43ce04', 'Shield Drone', 2, 0 WHERE EXISTS (SELECT 1 FROM public.wargear_options WHERE id = '25917772-a927-056a-bcb8-9976fc43ce04')
ON CONFLICT (wargear_option_id, name) DO UPDATE SET max_count = EXCLUDED.max_count, points = EXCLUDED.points;