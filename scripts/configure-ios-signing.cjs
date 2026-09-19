const fs = require('fs');
const path = require('path');

const teamId = process.env.TEAM_ID || '';
const profileName = process.env.PROFILE_NAME || '';
const profileUuid = process.env.PROFILE_UUID || '';
const hasAppleSignIn = process.env.HAS_APPLE_SIGNIN === 'true';

const pbxPath = path.resolve(__dirname, '../ios/App/App.xcodeproj/project.pbxproj');

if (!fs.existsSync(pbxPath)) {
  console.error('project.pbxproj not found at:', pbxPath);
  process.exit(1);
}

let content = fs.readFileSync(pbxPath, 'utf8');

console.log('--- Configuring iOS Signing ---');
console.log('TEAM_ID:', teamId);
console.log('PROFILE_NAME:', profileName);
console.log('PROFILE_UUID:', profileUuid);
console.log('HAS_APPLE_SIGNIN:', hasAppleSignIn);

if (teamId && profileName) {
  // Update PROVISIONING_PROFILE_SPECIFIER and add DEVELOPMENT_TEAM & PROVISIONING_PROFILE
  content = content.replaceAll(
    'PROVISIONING_PROFILE_SPECIFIER = "";',
    `PROVISIONING_PROFILE_SPECIFIER = "${profileName}";\n\t\t\t\tPROVISIONING_PROFILE = "${profileUuid}";\n\t\t\t\tDEVELOPMENT_TEAM = "${teamId}";`
  );

  // Also update TargetAttributes with DevelopmentTeam
  content = content.replace(
    'ProvisioningStyle = Manual;',
    `ProvisioningStyle = Manual;\n\t\t\t\t\t\tDevelopmentTeam = ${teamId};`
  );
}

// If provisioning profile does NOT contain Apple Sign In capability, remove entitlements reference so Xcode won't fail
if (!hasAppleSignIn) {
  console.log('⚠️ Apple Sign In capability not detected in profile. Disabling entitlements in build settings to prevent failure.');
  content = content.replaceAll(/CODE_SIGN_ENTITLEMENTS = [^;]+;/g, '');
} else {
  console.log('✅ Apple Sign In capability detected in profile.');
}

fs.writeFileSync(pbxPath, content, 'utf8');
console.log('Successfully updated project.pbxproj!');
