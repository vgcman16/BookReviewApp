#!/bin/bash

# Update bundle identifier in project.pbxproj
/usr/libexec/PlistBuddy -c "Set :objects:13B07F931A680F5B00A75B9A:buildSettings:PRODUCT_BUNDLE_IDENTIFIER com.zq78724vb2.bookreviewapp" BookReviewApp.xcodeproj/project.pbxproj

# Update bundle identifier in Info.plist if needed
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier com.zq78724vb2.bookreviewapp" BookReviewApp/Info.plist
