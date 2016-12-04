package com.zerotwoone.talkingabc.dialog;

import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.TextView;

import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;
import com.zerotwoone.talkingabc.find.FindActivity;
import com.zerotwoone.talkingabc.match.MatchActivity;
import com.zerotwoone.talkingabc.puzzle.PuzzleActivity;

public class GamesDialog extends BaseDialogBox {

	@Override
	protected View getContent(LayoutInflater inflater, ViewGroup container) {
		View ret = inflater.inflate(R.layout.games_dialog, container, false);

		ret.findViewById(R.id.clkFind).setOnClickListener(
				new OnClickListener() {
					@Override
					public void onClick(View v) {
						Intent intent = new Intent(getActivity(),
								FindActivity.class);
						startActivity(intent);
					}
				});

		ret.findViewById(R.id.clkMatch).setOnClickListener(
				new OnClickListener() {
					@Override
					public void onClick(View v) {
						Intent intent = new Intent(getActivity(),
								MatchActivity.class);
						startActivity(intent);
					}
				});

		ret.findViewById(R.id.clkPuzzle).setOnClickListener(
				new OnClickListener() {
					@Override
					public void onClick(View v) {
						Intent intent = new Intent(getActivity(),
								PuzzleActivity.class);
						startActivity(intent);
					}
				});
		
		((TextView) ret.findViewById(R.id.txtFind)).setTypeface(Static.CUBANO);
		((TextView) ret.findViewById(R.id.txtPuzzle)).setTypeface(Static.CUBANO);
		((TextView) ret.findViewById(R.id.txtMatch)).setTypeface(Static.CUBANO);
		
		return ret;
	}

	@Override
	protected String getHeaderText() {
		// TODO Auto-generated method stub
		return "Games";
	}
}
