package com.zerotwoone.talkingabc.dialog;

import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;

import en.com.zerotwoone.abclearning.R;

public class ExitConfirmDialog extends BaseDialogBox{
		
	@Override
	protected View getContent(LayoutInflater inflater, ViewGroup container) {
		View ret = inflater.inflate(R.layout.exit_confirm, container, false);

		ret.findViewById(R.id.imgYes).setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				getActivity().finish();				
			}
		});
		ret.findViewById(R.id.imgNo).setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				dismiss();
			}
		});
		
		return ret;
	}

	@Override
	protected String getHeaderText() {
		// TODO Auto-generated method stub
		return "Quit";
	}
}
