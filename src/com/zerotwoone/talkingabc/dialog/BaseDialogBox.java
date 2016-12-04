package com.zerotwoone.talkingabc.dialog;

import android.app.DialogFragment;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;

public abstract class BaseDialogBox extends DialogFragment {
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setStyle(STYLE_NO_TITLE, getTheme());
	}
	
	@Override
	public void onResume() {
		super.onResume();
		if (getDialog() != null) {
			Drawable drawable = new ColorDrawable(Color.TRANSPARENT);
			getDialog().getWindow().setBackgroundDrawable(drawable);
		}
	}
	
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		View ret = inflater.inflate(R.layout.dialog, container, false);
		
		((TextView)ret.findViewById(R.id.txtDialogHead)).setText(getHeaderText());
		((TextView)ret.findViewById(R.id.txtDialogHead)).setTypeface(Static.CUBANO);
		try {
			((FrameLayout)ret.findViewById(R.id.dialogContent)).addView(getContent(inflater
					, container));
		} catch (NullPointerException e) {e.printStackTrace();}
		
		return ret;
	}
	
	protected abstract View getContent(LayoutInflater inflater, ViewGroup container);
	
	protected abstract String getHeaderText ();
}
