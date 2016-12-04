package com.zerotwoone.talkingabc.dialog;

import android.content.Intent;
import android.net.Uri;
import android.preference.PreferenceManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;

import com.zerotwoone.talkingabc.Static;

import en.com.zerotwoone.abclearning.R;

public class SettingsDialog extends BaseDialogBox {

	public static final String MUSIC_CHECK_TAG = "musicCheckPref";

	private static final String GET_MORE_URL = "https://play.google.com/store/apps/developer?id=021Labs";
	private static final String FEEDBACK_URL = "https://play.google.com/store/apps/details?id=en.com.zerotwoonelabs.abclearning";

	@Override
	protected View getContent(LayoutInflater inflater, ViewGroup container) {
		View ret = inflater.inflate(R.layout.settings, container, false);
		CheckBox check = (CheckBox) ret.findViewById(R.id.chkMusic);
		check.setTypeface(Static.CUBANO);
		check.setChecked(PreferenceManager.getDefaultSharedPreferences(
				getActivity()).getBoolean(MUSIC_CHECK_TAG, true));
		check.setOnCheckedChangeListener(new OnCheckedChangeListener() {
			@Override
			public void onCheckedChanged(CompoundButton buttonView,
					boolean isChecked) {
				PreferenceManager.getDefaultSharedPreferences(getActivity())
						.edit().putBoolean(MUSIC_CHECK_TAG, isChecked).commit();
			}
		});

		ret.findViewById(R.id.imgMore).setOnClickListener(
				new OnClickListener() {

					@Override
					public void onClick(View v) {
						Intent i = new Intent(Intent.ACTION_VIEW);
						i.setData(Uri.parse(GET_MORE_URL));
						startActivity(i);
					}
				});

		ret.findViewById(R.id.imgFeedback).setOnClickListener(
				new OnClickListener() {

					@Override
					public void onClick(View v) {
						Intent i = new Intent(Intent.ACTION_VIEW);
						i.setData(Uri.parse(FEEDBACK_URL));
						startActivity(i);
					}
				});
		return ret;
	}

	@Override
	protected String getHeaderText() {
		return "SETTINGS";
	}

}
