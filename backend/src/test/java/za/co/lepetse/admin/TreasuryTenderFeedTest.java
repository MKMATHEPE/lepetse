package za.co.lepetse.admin;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.*;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;
class TreasuryTenderFeedTest {
 final ObjectMapper mapper=new ObjectMapper();
 JsonNode page(int n,boolean more){return mapper.valueToTree(Map.of("releases",java.util.stream.IntStream.range(0,n).mapToObj(i->Map.of("id",i)).toList(),"links",more?Map.of("next","next"):Map.of()));}
 @Test void fallsBackThenContinuesPastBadPageWithoutClaimingComplete()throws Exception{var batch=TreasuryTenderFeed.collect((p,s)->{if(s==50||p==2)throw new IOException("500");return p==1?page(2,true):page(1,false);});assertThat(batch.releases()).hasSize(3);assertThat(batch.complete()).isFalse();}
 @Test void failsClearlyIfNoPagesCanBeRead(){assertThatThrownBy(()->TreasuryTenderFeed.collect((p,s)->{throw new IOException("500");})).isInstanceOf(IOException.class);}
 @Test void emptyFeedIsSuccessfulNotAnError()throws Exception{var batch=TreasuryTenderFeed.collect((p,s)->page(0,false));assertThat(batch.complete()).isTrue();assertThat(batch.releases()).isEmpty();}
 @Test void stopsAfterThreeConsecutiveFailuresAndRetainsGoodPages()throws Exception{var calls=new ArrayList<Integer>();var batch=TreasuryTenderFeed.collect((p,s)->{calls.add(p);if(s==50)throw new IOException();if(p==1)return page(2,true);throw new IOException();});assertThat(batch.releases()).hasSize(2);assertThat(batch.complete()).isFalse();assertThat(calls).containsExactly(1,1,2,3,4);}
}
