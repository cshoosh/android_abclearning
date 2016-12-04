package com.zerotwoone.talkingabc.match;

public interface MatchCallback {
	public abstract void setMatchView(MatchView view);

	public abstract void onShowBegin(MatchView view);

	public abstract void onShowEnd(MatchView view);

	public abstract void onHideBegin(MatchView view);

	public abstract void onHideEnd(MatchView view);
	
	public abstract void playSound (int id);
		
	public boolean isLocked();

}
