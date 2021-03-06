package com.distelli.europa.pipeline;

import com.distelli.europa.models.ContainerRepo;
import com.distelli.europa.models.PipelineComponent;
import com.google.inject.Injector;
import lombok.extern.log4j.Log4j;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.Optional;

@Log4j
@Singleton
public class RunPipeline {
    @Inject
    private Injector _injector;

    public void runPipeline(List<? extends PipelineComponent> components,
                            ContainerRepo srcRepo,
                            String srcTag,
                            String digest) {
        Optional<PipelineComponent.PromotedImage> result = Optional.of(new PipelineComponent.PromotedImage(srcRepo, srcTag, digest));
        for ( PipelineComponent component : components) {
            try {
                if (!result.isPresent()) {
                    break;
                }
                _injector.injectMembers(component);
                result = component.execute(result.get());
            } catch ( Exception ex ) {
                // Ignore exceptions caused by threads being interrupted:
                if ( ex instanceof java.io.InterruptedIOException ) return;
                log.error(ex.getMessage(), ex);
            }
        }
    }
}
